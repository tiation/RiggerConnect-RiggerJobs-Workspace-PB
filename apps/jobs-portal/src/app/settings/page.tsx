'use client'

import { Suspense } from 'react'
import { UserCircleIcon, BellIcon, ShieldCheckIcon, KeyIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'

interface SettingsCardProps {
  title: string
  description: string
  icon: any
  children: React.ReactNode
}

function SettingsCard({ title, description, icon: Icon, children }: SettingsCardProps) {
  return (
    <div className="bg-background-card rounded-lg border border-border-dark p-6">
      <div className="flex items-start">
        <div className="p-2 bg-background-dark rounded-lg">
          <Icon className="h-6 w-6 text-primary-neon" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-medium text-text-primary">{title}</h3>
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

function Switch({ label, description, enabled = false }: { label: string; description?: string; enabled?: boolean }) {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-6">
        <button
          type="button"
          className={`${
            enabled ? 'bg-primary-neon' : 'bg-background-dark'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-neon focus:ring-offset-2`}
          role="switch"
          aria-checked={enabled}
        >
          <span
            className={`${
              enabled ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          />
        </button>
      </div>
      <div className="ml-3">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        {description && (
          <p className="text-sm text-text-secondary">{description}</p>
        )}
      </div>
    </div>
  )
}

function SettingsForm() {
  const { data: session } = useSession()

  if (!session?.user) {
    return <div>Not authenticated</div>
  }

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Account Settings"
        description="Manage your account information and preferences"
        icon={UserCircleIcon}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary">
              Name
            </label>
            <input
              type="text"
              id="name"
              defaultValue={session.user.name || ''}
              className="mt-1 block w-full rounded-md bg-background-dark border-border-dark text-text-primary min-h-touch"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary">
              Email
            </label>
            <input
              type="email"
              id="email"
              defaultValue={session.user.email || ''}
              className="mt-1 block w-full rounded-md bg-background-dark border-border-dark text-text-primary min-h-touch"
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Notifications"
        description="Choose what updates you want to receive"
        icon={BellIcon}
      >
        <div className="space-y-4">
          <Switch
            label="Email Notifications"
            description="Receive updates about your job applications"
            enabled={true}
          />
          <Switch
            label="SMS Notifications"
            description="Get instant updates via text message"
            enabled={false}
          />
          <Switch
            label="New Job Alerts"
            description="Be notified when new jobs match your preferences"
            enabled={true}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Privacy"
        description="Manage your privacy and security settings"
        icon={ShieldCheckIcon}
      >
        <div className="space-y-4">
          <Switch
            label="Profile Visibility"
            description="Make your profile visible to employers"
            enabled={true}
          />
          <Switch
            label="Activity Status"
            description="Show when you're actively looking for work"
            enabled={true}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Security"
        description="Manage your account security settings"
        icon={KeyIcon}
      >
        <div className="space-y-4">
          <Switch
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            enabled={false}
          />
          <button className="w-full min-h-touch bg-background-dark hover:bg-background-hover border border-primary-neon text-primary-neon hover:shadow-neon transition-all rounded">
            Change Password
          </button>
        </div>
      </SettingsCard>

      <div className="flex justify-end space-x-4">
        <button className="min-h-touch px-4 bg-background-dark hover:bg-background-hover border border-border-dark text-text-secondary hover:text-text-primary transition-all rounded">
          Cancel
        </button>
        <button className="min-h-touch px-4 bg-background-dark hover:bg-background-hover border border-primary-neon text-primary-neon hover:shadow-neon transition-all rounded">
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-neon to-secondary-neon text-transparent bg-clip-text">
        Settings
      </h1>
      
      <Suspense fallback={<div>Loading settings...</div>}>
        <SettingsForm />
      </Suspense>
    </div>
  )
}
