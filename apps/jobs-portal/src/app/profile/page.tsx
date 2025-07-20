import { UserCircleIcon, DocumentTextIcon, BriefcaseIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

// Mock user data - replace with actual user data fetch
const user = {
  name: 'John Smith',
  title: 'Senior Rigger',
  email: 'john.smith@example.com',
  phone: '+61 4XX XXX XXX',
  location: 'Perth, WA',
  experience: '10+ years',
  documents: [
    { id: 1, name: 'High Risk Work License', status: 'Valid', expiry: '2026-01-01' },
    { id: 2, name: 'Working at Heights', status: 'Valid', expiry: '2025-12-31' },
    { id: 3, name: 'First Aid Certificate', status: 'Expiring Soon', expiry: '2024-08-15' },
  ],
  certifications: [
    { id: 1, name: 'Advanced Rigging', issuer: 'WorkSafe WA', date: '2020' },
    { id: 2, name: 'Crane Operations', issuer: 'Industry Training', date: '2019' },
  ]
}

function ProfileHeader() {
  return (
    <div className="flex items-center space-x-4 p-4 bg-background-card rounded-lg border border-border-dark">
      <div className="h-20 w-20 rounded-full bg-background-hover flex items-center justify-center">
        <UserCircleIcon className="h-16 w-16 text-text-secondary" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{user.name}</h1>
        <p className="text-text-secondary">{user.title}</p>
        <p className="text-text-muted mt-1">{user.location}</p>
      </div>
    </div>
  )
}

function ContactInfo() {
  return (
    <div className="p-4 bg-background-card rounded-lg border border-border-dark">
      <h2 className="text-lg font-semibold mb-4 text-text-primary">Contact Information</h2>
      <div className="space-y-2">
        <p className="text-text-secondary">Email: {user.email}</p>
        <p className="text-text-secondary">Phone: {user.phone}</p>
      </div>
    </div>
  )
}

function DocumentList() {
  return (
    <div className="p-4 bg-background-card rounded-lg border border-border-dark">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Documents</h2>
        <button className="text-primary-neon hover:text-primary-hover transition-colors">
          Upload New
        </button>
      </div>
      <div className="space-y-3">
        {user.documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-3 bg-background-dark rounded border border-border-dark">
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-text-secondary mr-2" />
              <div>
                <p className="text-text-primary">{doc.name}</p>
                <p className="text-sm text-text-muted">Expires: {doc.expiry}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${
              doc.status === 'Valid' 
                ? 'bg-green-900/20 text-green-400'
                : 'bg-yellow-900/20 text-yellow-400'
            }`}>
              {doc.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CertificationList() {
  return (
    <div className="p-4 bg-background-card rounded-lg border border-border-dark">
      <h2 className="text-lg font-semibold mb-4 text-text-primary">Certifications</h2>
      <div className="space-y-3">
        {user.certifications.map((cert) => (
          <div key={cert.id} className="flex items-center p-3 bg-background-dark rounded border border-border-dark">
            <AcademicCapIcon className="h-5 w-5 text-text-secondary mr-2" />
            <div>
              <p className="text-text-primary">{cert.name}</p>
              <p className="text-sm text-text-muted">{cert.issuer} • {cert.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <ProfileHeader />
      <ContactInfo />
      <DocumentList />
      <CertificationList />
      
      <button className="w-full min-h-touch bg-background-dark hover:bg-background-hover border border-primary-neon text-primary-neon hover:shadow-neon transition-all rounded">
        Edit Profile
      </button>
    </div>
  )
}
