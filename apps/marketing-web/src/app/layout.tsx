import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rigger Connect - Professional Workforce Management Platform',
  description: 'Connect skilled riggers with construction projects. Streamline workforce management, improve safety, and build stronger construction teams with Rigger Connect.',
  keywords: [
    'rigger connect',
    'construction workforce',
    'rigger jobs',
    'crane operator',
    'construction safety',
    'workforce management',
    'construction platform',
    'skilled trades'
  ],
  authors: [{ name: 'Tiation' }],
  creator: 'Tiation',
  publisher: 'Rigger Connect',
  openGraph: {
    title: 'Rigger Connect - Professional Workforce Management Platform',
    description: 'Connect skilled riggers with construction projects. Streamline workforce management and improve safety.',
    url: 'https://rigger-connect.vercel.app',
    siteName: 'Rigger Connect',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Rigger Connect Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rigger Connect - Professional Workforce Management',
    description: 'Connect skilled riggers with construction projects.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}