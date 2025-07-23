'use client';

export default function StaffPage() {
  return (
    <main className="min-h-screen pt-24 bg-background-dark">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-primary text-transparent bg-clip-text">
          Find Qualified Staff
        </h1>

        {/* Search filters */}
        <div className="mb-8 p-6 bg-background-darker rounded-lg border border-primary-cyan">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by skill or certification"
              className="bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
            />
            <select className="bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan">
              <option value="">Select Location</option>
              <option value="perth">Perth</option>
              <option value="pilbara">Pilbara</option>
              <option value="kimberley">Kimberley</option>
            </select>
            <button className="bg-gradient-primary text-white px-4 py-2 rounded-md font-medium hover:shadow-neon-magenta transition-all duration-300">
              Search
            </button>
          </div>
        </div>

        {/* Staff cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((staff) => (
            <div
              key={staff}
              className="bg-background-darker p-6 rounded-lg border border-primary-cyan hover:shadow-neon-cyan transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">Experienced Rigger</h3>
              <div className="text-gray-300 mb-4">
                <p className="mb-2">10+ years experience</p>
                <p className="mb-2">✓ High Risk Work License</p>
                <p>✓ Current Medical</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary-cyan">Perth, WA</span>
                <button className="bg-gradient-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-neon-magenta transition-all duration-300">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
