export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 bg-background-dark">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-primary text-transparent bg-clip-text">
          About RiggerHireApp
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              RiggerHireApp is Western Australia's premier platform for connecting qualified rigging and construction professionals with leading industry employers. We're committed to maintaining the highest standards of safety, compliance, and professional excellence.
            </p>
            <div className="bg-background-darker p-6 rounded-lg border border-primary-cyan">
              <h3 className="text-xl font-semibold mb-4 text-white">Key Benefits</h3>
              <ul className="text-gray-300 space-y-2">
                <li>✓ Verified professional profiles</li>
                <li>✓ Real-time certification tracking</li>
                <li>✓ Comprehensive safety protocols</li>
                <li>✓ Streamlined hiring process</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">Industry Focus</h2>
            <p className="text-gray-300 mb-6">
              We specialize in serving Western Australia's construction and mining sectors, providing enterprise-grade solutions for:
            </p>
            <div className="space-y-4">
              <div className="bg-background-darker p-6 rounded-lg border border-primary-magenta">
                <h3 className="text-xl font-semibold mb-2 text-white">Construction</h3>
                <p className="text-gray-300">
                  Supporting major infrastructure and building projects across WA
                </p>
              </div>
              <div className="bg-background-darker p-6 rounded-lg border border-primary-cyan">
                <h3 className="text-xl font-semibold mb-2 text-white">Mining</h3>
                <p className="text-gray-300">
                  Facilitating operations in key mining regions including Pilbara and Goldfields
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-8 bg-gradient-primary text-transparent bg-clip-text">
            Ready to elevate your workforce?
          </h2>
          <button className="bg-gradient-primary text-white px-8 py-3 rounded-lg font-semibold shadow-neon-cyan hover:shadow-neon-magenta transition-all duration-300">
            Get Started Today
          </button>
        </div>
      </div>
    </main>
  );
}
