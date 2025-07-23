'use client';

export default function RegisterPage() {
  return (
    <main className="min-h-screen pt-24 bg-background-dark">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-primary text-transparent bg-clip-text">
          Register Your Business
        </h1>

        <form className="space-y-6 bg-background-darker p-6 rounded-lg border border-primary-cyan">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-300 mb-2">
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              className="w-full bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
              placeholder="Enter your business name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
              placeholder="Enter your contact email"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
              Contact Phone
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
              placeholder="Enter your contact phone number"
            />
          </div>
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-2">
              Industry
            </label>
            <select
              id="industry"
              className="w-full bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
            >
              <option value="construction">Construction</option>
              <option value="mining">Mining</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              Additional Information
            </label>
            <textarea
              id="message"
              rows={3}
              className="w-full bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
              placeholder="Enter any additional information"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-primary text-white px-8 py-3 rounded-lg font-semibold shadow-neon-cyan hover:shadow-neon-magenta transition-all duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </main>
  );
}
