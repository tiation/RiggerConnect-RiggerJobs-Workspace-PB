import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PricingSection = () => {
  const [loading, setLoading] = useState({});

  const pricingTiers = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for individual riggers and small teams",
      features: [
        "Up to 5 job applications",
        "Basic profile management",
        "Standard support",
        "Mobile app access",
        "Basic analytics"
      ],
      priceId: "price_starter_monthly",
      popular: false,
      gradient: "from-cyan-400/20 to-purple-600/20"
    },
    {
      name: "Professional",
      price: "$89",
      period: "/month",
      description: "Ideal for experienced riggers and contractors",
      features: [
        "Unlimited job applications",
        "Advanced profile features",
        "Priority support",
        "Advanced analytics",
        "Document management",
        "Certificate tracking",
        "Network expansion tools"
      ],
      priceId: "price_professional_monthly",
      popular: true,
      gradient: "from-pink-400/20 to-cyan-600/20"
    },
    {
      name: "Enterprise",
      price: "$299",
      period: "/month",
      description: "For companies and large organizations",
      features: [
        "Everything in Professional",
        "Team management",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced compliance tools",
        "White-label options",
        "API access",
        "Custom reporting"
      ],
      priceId: "price_enterprise_monthly",
      popular: false,
      gradient: "from-purple-400/20 to-pink-600/20"
    }
  ];

  const handleSubscribe = async (priceId, planName) => {
    setLoading({ ...loading, [priceId]: true });
    
    try {
      const stripe = await stripePromise;
      
      // Call your backend to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          mode: 'subscription',
        }),
      });

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error('Stripe checkout error:', result.error);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading({ ...loading, [priceId]: false });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/10 via-transparent to-pink-500/10"></div>
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Scale your rigging career with enterprise-grade tools designed for Western Australia's mining and construction industry
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`relative rounded-2xl bg-gradient-to-br ${tier.gradient} backdrop-blur-xl border border-gray-700/50 p-8 ${
                tier.popular 
                  ? 'transform scale-105 border-cyan-400/50 shadow-2xl shadow-cyan-400/25' 
                  : 'hover:scale-105'
              } transition-all duration-300 group`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyan-400 to-pink-400 text-black px-6 py-2 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-gray-400 mb-4">{tier.description}</p>
                <div className="flex items-baseline justify-center mb-6">
                  <span className="text-5xl font-bold text-white">{tier.price}</span>
                  <span className="text-gray-400 ml-2">{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(tier.priceId, tier.name)}
                disabled={loading[tier.priceId]}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-cyan-400 to-pink-400 text-black hover:from-cyan-300 hover:to-pink-300 shadow-lg shadow-cyan-400/25'
                    : 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600 hover:border-gray-500'
                } ${loading[tier.priceId] ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading[tier.priceId] ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Get Started with ${tier.name}`
                )}
              </button>

              {tier.popular && (
                <p className="text-center text-sm text-gray-400 mt-4">
                  ⚡ 30-day free trial included
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            All plans include 30-day money-back guarantee • No setup fees • Cancel anytime
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>🔒 Secure payments via Stripe</span>
            <span>🛡️ Enterprise-grade security</span>
            <span>🇦🇺 Australian business compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
