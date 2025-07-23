'use client';

import Link from 'next/link';

export default function RegistrationPendingPage() {
  return (
    <main className="min-h-screen pt-24 bg-background-dark">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-primary text-transparent bg-clip-text">
            Registration Pending
          </h1>

          <div className="bg-background-darker p-8 rounded-lg border border-primary-cyan shadow-neon-cyan mb-8">
            <div className="animate-pulse mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-cyan/30" />
            </div>

            <h2 className="text-2xl font-semibold text-white mb-4">
              Thank You for Registering
            </h2>

            <p className="text-gray-300 mb-6">
              Your business registration is currently being reviewed. This process typically takes 1-2 business days.
              We will verify your:
            </p>

            <ul className="text-left text-gray-300 mb-8 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-cyan rounded-full mr-3"></span>
                ABN and business details
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-cyan rounded-full mr-3"></span>
                Business license/permit
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-cyan rounded-full mr-3"></span>
                Insurance documentation
              </li>
            </ul>

            <p className="text-gray-300 mb-8">
              Once verified, you'll receive an email with your login credentials and next steps.
            </p>

            <div className="space-y-4">
              <Link
                href="/contact"
                className="block w-full bg-gradient-primary text-white px-8 py-3 rounded-lg font-semibold shadow-neon-cyan hover:shadow-neon-magenta transition-all duration-300"
              >
                Contact Support
              </Link>
              <Link
                href="/"
                className="block w-full bg-background-dark text-white px-8 py-3 rounded-lg font-semibold border border-primary-cyan hover:shadow-neon-cyan transition-all duration-300"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
