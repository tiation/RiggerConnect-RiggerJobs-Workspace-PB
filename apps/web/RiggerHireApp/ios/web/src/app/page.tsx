import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-background-darker">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-primary text-transparent bg-clip-text">
            Find Qualified Mining & Construction Staff
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Enterprise-grade staffing solutions for Western Australia's leading construction and mining companies
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="bg-gradient-primary text-white px-8 py-3 rounded-lg font-semibold shadow-neon-cyan hover:shadow-neon-magenta transition-all duration-300"
            >
              Post a Job
            </Link>
            <Link
              href="/staff"
              className="border border-primary-cyan text-white px-8 py-3 rounded-lg font-semibold hover:shadow-neon-cyan transition-all duration-300"
            >
              Find Staff
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-primary text-transparent bg-clip-text">
            Why Choose RiggerHireApp?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background-darker p-8 rounded-lg border border-primary-cyan hover:shadow-neon-cyan transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4">Verified Professionals</h3>
              <p className="text-gray-300">
                Access a thoroughly vetted pool of qualified riggers, doggers, and crane operators
              </p>
            </div>
            <div className="bg-background-darker p-8 rounded-lg border border-primary-magenta hover:shadow-neon-magenta transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4">Enterprise Security</h3>
              <p className="text-gray-300">
                Industry-leading verification protocols and secure hiring processes
              </p>
            </div>
            <div className="bg-background-darker p-8 rounded-lg border border-primary-cyan hover:shadow-neon-cyan transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4">Compliance First</h3>
              <p className="text-gray-300">
                All staff are verified for current certifications and compliance requirements
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
