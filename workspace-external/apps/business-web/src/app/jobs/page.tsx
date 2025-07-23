import { getJobs } from '@/lib/api';
import { Job } from '@/lib/types/job';

export const revalidate = 300; // Revalidate every 5 minutes

export default async function JobsPage() {
  const jobs: Job[] = await getJobs();
  return (
    <main className="min-h-screen pt-24 bg-background-dark">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-primary text-transparent bg-clip-text">
          Available Jobs
        </h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-background-darker p-6 rounded-lg border border-primary-cyan hover:shadow-neon-cyan transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
              <p className="text-gray-300 mb-4">{job.description}</p>
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
