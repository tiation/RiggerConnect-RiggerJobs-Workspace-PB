import React from 'react';
import PricingCalculator from '@/components/pricing/PricingCalculator';
import '@/styles/pricing.css';

export const metadata = {
  title: 'RiggerHireApp - Transparent Pricing',
  description: 'Enterprise-grade pricing plans for construction and mining businesses in Western Australia'
};

const pricingPlans = [
  {
    name: 'Starter',
    price: 299,
    description: 'Perfect for small construction teams',
    features: [
      'Up to 10 active job postings',
      'Basic worker verification',
      'Standard support',
      'Safety compliance tracking',
      'Mobile app access'
    ]
  },
  {
    name: 'Professional',
    price: 599,
    description: 'Ideal for growing contractors',
    features: [
      'Up to 50 active job postings',
      'Advanced worker verification',
      'Priority support',
      'Custom safety checklists',
      'API access',
      'Analytics dashboard'
    ]
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large-scale operations',
    features: [
      'Unlimited job postings',
      'Full workforce management',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced analytics',
      'White-label options'
    ]
  }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 neon-text bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            Transparent Pricing
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Choose the plan that best fits your business needs. All plans include
            our core safety features and compliance with Western Australian standards.
          </p>
        </header>

        {/* Pricing Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className="p-6 bg-gray-800 rounded-lg neon-border">
              <h3 className="text-2xl font-semibold text-cyan-400 mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">
                  {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                </span>
                {typeof plan.price === 'number' && <span className="text-gray-400">/month</span>}
              </div>
              <p className="text-gray-300 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-cyan-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-semibold hover:from-cyan-600 hover:to-fuchsia-600 transition-all duration-200">
                {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        {/* Pricing Calculator */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center neon-text">
            Calculate Your ROI
          </h2>
          <PricingCalculator />
        </section>

        {/* Enterprise Features */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8 neon-text">
            Enterprise-Grade Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                Security & Compliance
              </h3>
              <p className="text-gray-300">
                Industry-leading security practices and full compliance with
                Western Australian safety standards.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                API Access
              </h3>
              <p className="text-gray-300">
                Robust API for seamless integration with your existing
                business tools and workflows.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                24/7 Support
              </h3>
              <p className="text-gray-300">
                Dedicated support team available around the clock to
                assist with any questions or issues.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center neon-text">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                Can I switch plans later?
              </h3>
              <p className="text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time.
                Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                Do you offer custom solutions?
              </h3>
              <p className="text-gray-300">
                Yes, our Enterprise plan can be customized to meet your
                specific business needs. Contact our sales team to learn more.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6 neon-text">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join leading construction and mining companies in Western Australia
            who trust RiggerHireApp for their staffing needs.
          </p>
          <div className="space-x-4">
            <button className="py-3 px-8 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-semibold hover:from-cyan-600 hover:to-fuchsia-600 transition-all duration-200">
              Start Free Trial
            </button>
            <button className="py-3 px-8 rounded-lg border-2 border-cyan-400 text-cyan-400 font-semibold hover:bg-cyan-400/10 transition-all duration-200">
              Contact Sales
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
