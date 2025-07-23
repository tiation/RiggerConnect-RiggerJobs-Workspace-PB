import { Suspense } from 'react'
import { BriefcaseIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

// Mock data - replace with actual API call
const jobs = [
  {
    id: 1,
    title: 'Senior Rigger',
    company: 'WA Mining Corp',
    location: 'Perth, WA',
    type: 'Full-time',
    salary: '$120k - $150k',
    posted: '2d ago',
  },
  {
    id: 2,
    title: 'Crane Operator',
    company: 'Construction Solutions',
    location: 'Karratha, WA',
    type: 'Contract',
    salary: '$90/hr',
    posted: '1d ago',
  },
]

function JobCard({ job }: { job: typeof jobs[0] }) {
  return (
    <div className="bg-background-card rounded-lg p-4 hover:bg-background-hover transition-colors border border-border-dark">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{job.title}</h3>
          <p className="text-text-secondary">{job.company}</p>
        </div>
        <span className="text-sm text-text-muted">{job.posted}</span>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center text-text-secondary">
          <MapPinIcon className="h-5 w-5 mr-1" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-text-secondary">
          <BriefcaseIcon className="h-5 w-5 mr-1" />
          <span>{job.type}</span>
        </div>
        <div className="flex items-center text-text-secondary">
          <CurrencyDollarIcon className="h-5 w-5 mr-1" />
          <span>{job.salary}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <button 
          className="w-full rounded min-h-touch bg-background-dark hover:bg-background-hover border border-primary-neon text-primary-neon hover:shadow-neon transition-all"
        >
          Apply Now
        </button>
      </div>
    </div>
  )
}

function JobsList() {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}

function SearchBar() {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search jobs..."
        className="w-full h-12 pl-4 pr-10 rounded bg-background-card border border-border-dark text-text-primary placeholder:text-text-muted focus:border-primary-neon focus:outline-none focus:ring-1 focus:ring-primary-neon"
      />
      <button 
        className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary-neon p-2"
        aria-label="Search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  )
}

export default function JobsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-neon to-secondary-neon text-transparent bg-clip-text">
        Available Jobs
      </h1>
      
      <div className="mb-6">
        <SearchBar />
      </div>

      <Suspense fallback={<div>Loading jobs...</div>}>
        <JobsList />
      </Suspense>
    </div>
  )
}
