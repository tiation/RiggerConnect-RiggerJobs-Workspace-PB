'use client';

export default function JobsPage() {
  return (
    <main className="min-h-screen pt-24 bg-background-dark">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-primary text-transparent bg-clip-text">
          Available Jobs
        </h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder job cards */}
          {[1, 2, 3].map((job) => (
            <div
              key={job}
              className="bg-background-darker p-6 rounded-lg border border-primary-cyan hover:shadow-neon-cyan transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">Senior Rigger</h3>
              <p className="text-gray-300 mb-4">
                Experienced rigger needed for major construction project in Perth.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-primary-cyan">Full Time</span>
                <button className="bg-gradient-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-neon-magenta transition-all duration-300">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
