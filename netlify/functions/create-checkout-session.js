/**
 * ============================================
 * Créer une session Stripe Checkout
 * ============================================
 *
 * Endpoint: /.netlify/functions/create-checkout-session
 * Method: POST
 * Body: { uid, email }
 *
 * Retourne: { sessionId, url }
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only POST allowed
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const { uid, email } = JSON.parse(event.body || '{}');

    if (!uid || !email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'uid and email required' })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Get site URL from environment or event headers
    const siteUrl = process.env.URL || `https://${event.headers.host}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Bible Chantée - Accès Premium',
              description: 'Accès illimité à vie - 1189 chapitres en 7 langues',
              images: ['https://biblechantee.com/icons/icon-512x512.png']
            },
            unit_amount: 99 // $0.99 = 99 cents
          },
          quantity: 1
        }
      ],
      customer_email: email,
      client_reference_id: uid, // IMPORTANT: associer le paiement à l'utilisateur
      metadata: {
        uid: uid,
        email: email
      },
      success_url: `${siteUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/lecteur.html?canceled=true`
    });

    console.log('✅ Stripe session created:', session.id, 'for uid:', uid);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url
      })
    };

  } catch (error) {
    console.error('❌ Error creating checkout session:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        message: error.message
      })
    };
  }
};
