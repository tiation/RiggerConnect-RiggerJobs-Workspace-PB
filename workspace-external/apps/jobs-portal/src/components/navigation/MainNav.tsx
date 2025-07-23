import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BriefcaseIcon, 
  ClipboardDocumentListIcon, 
  MagnifyingGlassIcon, 
  UserCircleIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
  { name: 'My Jobs', href: '/my-jobs', icon: ClipboardDocumentListIcon },
  { name: 'Search', href: '/search', icon: MagnifyingGlassIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

export function MainNav() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-background-dark border-t border-border-dark md:relative md:border-t-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between md:justify-start">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex flex-col items-center p-3 min-h-touch min-w-touch
                  transition-all duration-300 ease-in-out
                  ${isActive 
                    ? 'text-primary-neon shadow-neon' 
                    : 'text-text-secondary hover:text-primary-hover'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="h-6 w-6" aria-hidden="true" />
                <span className="mt-1 text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
