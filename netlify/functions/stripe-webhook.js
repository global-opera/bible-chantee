/**
 * ============================================
 * Stripe Webhook Handler
 * ============================================
 *
 * Endpoint: /.netlify/functions/stripe-webhook
 * Method: POST
 *
 * Gère les événements Stripe:
 * - checkout.session.completed → Activer premium
 * - payment_intent.succeeded → Confirmation
 * - payment_intent.payment_failed → Log erreur
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Webhook signing secret (obtenu dans Stripe Dashboard)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.handler = async (event) => {
  // Only POST allowed
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Vérifier la signature Stripe
    const sig = event.headers['stripe-signature'];

    let stripeEvent;

    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        sig,
        endpointSecret
      );
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Webhook Error: ${err.message}` })
      };
    }

    console.log('📥 Stripe event received:', stripeEvent.type);

    // Gérer l'événement
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripeEvent.data.object);
        break;

      case 'payment_intent.succeeded':
        console.log('💰 Payment succeeded:', stripeEvent.data.object.id);
        break;

      case 'payment_intent.payment_failed':
        console.error('❌ Payment failed:', stripeEvent.data.object.id);
        break;

      default:
        console.log('ℹ️ Unhandled event type:', stripeEvent.type);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };

  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

/**
 * Gérer le paiement complété
 * Activer le premium pour l'utilisateur
 */
async function handleCheckoutCompleted(session) {
  console.log('🎉 Checkout completed for session:', session.id);

  const uid = session.client_reference_id || session.metadata?.uid;
  const email = session.customer_email || session.metadata?.email;

  if (!uid) {
    console.error('⚠️ No uid found in session');
    return;
  }

  // Connexion Supabase
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  try {
    // Vérifier si l'utilisateur existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('uid, email, is_premium')
      .eq('uid', uid)
      .maybeSingle();

    if (!existingUser) {
      console.log('📝 Creating new user:', uid);

      // Créer l'utilisateur s'il n'existe pas
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          uid: uid,
          email: email,
          credits: 0, // Premium = pas besoin de crédits
          is_premium: true,
          stripe_customer_id: session.customer,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('❌ Error creating user:', insertError);
        return;
      }

      console.log('✅ User created with premium status');
    } else {
      console.log('📝 Updating existing user:', uid);

      // Mettre à jour l'utilisateur existant
      const { error: updateError } = await supabase
        .from('users')
        .update({
          is_premium: true,
          stripe_customer_id: session.customer,
          updated_at: new Date().toISOString()
        })
        .eq('uid', uid);

      if (updateError) {
        console.error('❌ Error updating user:', updateError);
        return;
      }

      console.log('✅ User upgraded to premium');
    }

    // Logger la transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_uid: uid,
        type: 'purchase',
        amount: 99, // cents
        description: 'Premium upgrade - Stripe payment',
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent,
        created_at: new Date().toISOString()
      });

    if (transactionError) {
      console.error('⚠️ Error logging transaction:', transactionError);
      // Non-bloquant, on continue
    }

    console.log('✅ Premium activation completed for uid:', uid);

  } catch (error) {
    console.error('❌ Error in handleCheckoutCompleted:', error);
  }
}
