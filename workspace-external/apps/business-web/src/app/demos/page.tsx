import React from 'react';
import PlatformOverview from '@/components/demos/PlatformOverview';
import '@/styles/demos.css';

export const metadata = {
  title: 'RiggerHireApp - Interactive Demos',
  description: 'Interactive demonstrations of the RiggerHireApp platform features and functionality.'
};

export default function DemosPage() {
  return (
    <main className="demo-container min-h-screen bg-gradient-to-r from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 neon-text bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            Interactive Platform Demo
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Experience the enterprise-grade features of RiggerHireApp. Our platform streamlines 
            worker hiring, safety compliance, and business operations for the construction and 
            mining industries in Western Australia.
          </p>
        </header>

        {/* Platform Overview Demo */}
        <section className="mb-16">
          <PlatformOverview />
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-16">
          {/* Worker Verification */}
          <div className="p-6 bg-gray-800 rounded-lg neon-border">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">
              Worker Verification
            </h3>
            <p className="text-gray-300 mb-4">
              Automated verification of worker credentials, certifications, and safety compliance 
              status.
            </p>
            <button className="demo-button w-full">
              Learn More
            </button>
          </div>

          {/* Safety Compliance */}
          <div className="p-6 bg-gray-800 rounded-lg neon-border">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">
              Safety Compliance
            </h3>
            <p className="text-gray-300 mb-4">
              Integration with WorkSafe WA standards and automated compliance tracking for all 
              workers.
            </p>
            <button className="demo-button w-full">
              View Details
            </button>
          </div>

          {/* Business Operations */}
          <div className="p-6 bg-gray-800 rounded-lg neon-border">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">
              Business Operations
            </h3>
            <p className="text-gray-300 mb-4">
              Streamlined job posting, worker management, and payment processing for construction 
              businesses.
            </p>
            <button className="demo-button w-full">
              Explore Features
            </button>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-6 neon-text">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join leading construction and mining companies in Western Australia who trust 
            RiggerHireApp for their staffing needs.
          </p>
          <button className="demo-button text-lg px-8 py-4">
            Start Free Trial
          </button>
        </section>
      </div>
    </main>
  );
}
