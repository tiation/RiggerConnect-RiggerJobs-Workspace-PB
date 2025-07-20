import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
import { BriefcaseIcon, MapPinIcon, CalendarIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline'

const prisma = new PrismaClient()

async function getApplications(userId: string) {
  return prisma.jobApplication.findMany({
    where: { userId },
    include: {
      job: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

function ApplicationStatus({ status }: { status: string }) {
  const statusConfig = {
    pending: {
      icon: ClockIcon,
      text: 'Pending',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20',
    },
    accepted: {
      icon: CheckCircleIcon,
      text: 'Accepted',
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
    },
    rejected: {
      icon: XCircleIcon,
      text: 'Rejected',
      color: 'text-red-400',
      bgColor: 'bg-red-900/20',
    },
  }[status.toLowerCase()]

  const Icon = statusConfig?.icon || ClockIcon

  return (
    <div className={`flex items-center ${statusConfig?.color} ${statusConfig?.bgColor} px-3 py-1 rounded-full text-sm`}>
      <Icon className="w-4 h-4 mr-1" />
      <span>{statusConfig?.text || status}</span>
    </div>
  )
}

function ApplicationCard({ application }: { application: any }) {
  return (
    <div className="bg-background-card rounded-lg p-4 hover:bg-background-hover transition-colors border border-border-dark">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{application.job.title}</h3>
          <p className="text-text-secondary">{application.job.company}</p>
        </div>
        <ApplicationStatus status={application.status} />
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-text-secondary">
          <MapPinIcon className="h-5 w-5 mr-2" />
          <span>{application.job.location}</span>
        </div>
        <div className="flex items-center text-text-secondary">
          <BriefcaseIcon className="h-5 w-5 mr-2" />
          <span>{application.job.type}</span>
        </div>
        <div className="flex items-center text-text-secondary">
          <CalendarIcon className="h-5 w-5 mr-2" />
          <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-4">
        <button className="flex-1 min-h-touch bg-background-dark hover:bg-background-hover border border-primary-neon text-primary-neon hover:shadow-neon transition-all rounded">
          View Details
        </button>
        <button className="flex-1 min-h-touch bg-background-dark hover:bg-background-hover border border-border-dark text-text-secondary hover:text-text-primary transition-all rounded">
          Withdraw
        </button>
      </div>
    </div>
  )
}

async function ApplicationList() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return <div>Not authenticated</div>
  }

  const applications = await getApplications(session.user.id)

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <BriefcaseIcon className="mx-auto h-12 w-12 text-text-muted" />
        <h3 className="mt-2 text-sm font-medium text-text-primary">No applications yet</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Start applying for jobs to track your applications here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  )
}

export default function MyJobsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-neon to-secondary-neon text-transparent bg-clip-text">
        My Applications
      </h1>
      
      <Suspense fallback={<div>Loading applications...</div>}>
        <ApplicationList />
      </Suspense>
    </div>
  )
}
