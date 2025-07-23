import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MainNav } from '@/components/navigation/MainNav'
import { Analytics } from '@vercel/analytics/react'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'RiggerHireApp - Enterprise Job Platform',
  description: 'Enterprise-grade job platform for the construction and mining industries in Western Australia',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-background-dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full text-text-primary antialiased`}
      >
        <div className="min-h-full">
          <main className="pb-16 md:pb-0">
            {children}
          </main>
          <MainNav />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
