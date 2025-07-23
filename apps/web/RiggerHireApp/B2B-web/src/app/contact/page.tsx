'use client';

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24 bg-background-dark">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-primary text-transparent bg-clip-text">
          Contact Us
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-white">Get in Touch</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-background-darker border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-background-darker border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full bg-background-darker border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
                  placeholder="Enter subject"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full bg-background-darker border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
                  placeholder="Enter your message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-primary text-white px-8 py-3 rounded-lg font-semibold shadow-neon-cyan hover:shadow-neon-magenta transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-white">Office Location</h2>
            <div className="bg-background-darker p-6 rounded-lg border border-primary-cyan mb-8">
              <h3 className="text-xl font-semibold mb-4 text-white">Perth Office</h3>
              <div className="text-gray-300 space-y-2">
                <p>123 St Georges Terrace</p>
                <p>Perth, WA 6000</p>
                <p>Australia</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6 text-white">Support Hours</h2>
            <div className="bg-background-darker p-6 rounded-lg border border-primary-magenta">
              <div className="text-gray-300 space-y-2">
                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
