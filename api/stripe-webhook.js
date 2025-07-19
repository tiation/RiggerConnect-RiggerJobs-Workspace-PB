const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const app = express();

// Middleware to verify Stripe webhook signature
const verifyStripeSignature = (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    req.stripeEvent = event;
    next();
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

// Create checkout session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, mode = 'subscription' } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
      metadata: {
        priceId: priceId,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook handler
app.post('/api/stripe-webhook', verifyStripeSignature, async (req, res) => {
  const event = req.stripeEvent;
  
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment was successful!', session);
      
      // Handle successful payment
      await handleSuccessfulPayment(session);
      break;
      
    case 'customer.subscription.created':
      const subscription = event.data.object;
      console.log('Subscription created:', subscription);
      
      // Handle new subscription
      await handleNewSubscription(subscription);
      break;
      
    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object;
      console.log('Subscription updated:', updatedSubscription);
      
      // Handle subscription update
      await handleSubscriptionUpdate(updatedSubscription);
      break;
      
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      console.log('Subscription cancelled:', deletedSubscription);
      
      // Handle subscription cancellation
      await handleSubscriptionCancellation(deletedSubscription);
      break;
      
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('Payment succeeded for invoice:', invoice);
      
      // Handle successful recurring payment
      await handleInvoicePaymentSucceeded(invoice);
      break;
      
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      console.log('Payment failed for invoice:', failedInvoice);
      
      // Handle failed payment
      await handleInvoicePaymentFailed(failedInvoice);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({ received: true });
});

// Helper functions
async function handleSuccessfulPayment(session) {
  // Update user subscription status in database
  // Send welcome email
  // Grant access to premium features
  
  try {
    // Example: Update user in database
    /*
    await db.user.update({
      where: { id: session.client_reference_id },
      data: {
        stripeCustomerId: session.customer,
        subscriptionStatus: 'active',
        subscriptionId: session.subscription,
        planType: session.metadata.priceId,
        subscriptionStartDate: new Date(),
      }
    });
    */
    
    console.log('Successfully handled payment for session:', session.id);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleNewSubscription(subscription) {
  // Update subscription details in database
  // Send confirmation email
  
  try {
    console.log('New subscription processed:', subscription.id);
  } catch (error) {
    console.error('Error handling new subscription:', error);
  }
}

async function handleSubscriptionUpdate(subscription) {
  // Handle plan changes, quantity updates, etc.
  
  try {
    console.log('Subscription updated:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

async function handleSubscriptionCancellation(subscription) {
  // Update user access
  // Send cancellation confirmation
  
  try {
    console.log('Subscription cancelled:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice) {
  // Update payment history
  // Send receipt
  
  try {
    console.log('Invoice payment succeeded:', invoice.id);
  } catch (error) {
    console.error('Error handling successful invoice payment:', error);
  }
}

async function handleInvoicePaymentFailed(invoice) {
  // Send payment failure notification
  // Update subscription status
  
  try {
    console.log('Invoice payment failed:', invoice.id);
  } catch (error) {
    console.error('Error handling failed invoice payment:', error);
  }
}

// Customer portal endpoint
app.post('/api/create-portal-session', async (req, res) => {
  try {
    const { customerId } = req.body;
    
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_URL}/account`,
    });
    
    res.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
