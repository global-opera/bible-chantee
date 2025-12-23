const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body);
    
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Email requis' })
      };
    }

    // Chercher les paiements réussis pour cet email dans Stripe
    const sessions = await stripe.checkout.sessions.list({
      customer_details: { email: email },
      status: 'complete',
      limit: 10
    });

    // Ou chercher par customer email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    let hasPaid = false;

    if (sessions.data.length > 0) {
      hasPaid = true;
    } else if (customers.data.length > 0) {
      const charges = await stripe.charges.list({
        customer: customers.data[0].id,
        limit: 10
      });
      hasPaid = charges.data.some(c => c.paid && c.status === 'succeeded');
    }

    if (hasPaid) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'bc_premium=1; Path=/; Max-Age=31536000; Secure; SameSite=Lax; HttpOnly'
        },
        body: JSON.stringify({ success: true, message: 'Premium restauré!' })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, message: 'Aucun paiement trouvé pour cet email' })
      };
    }

  } catch (error) {
    console.error('Recover premium error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Erreur serveur' })
    };
  }
};

