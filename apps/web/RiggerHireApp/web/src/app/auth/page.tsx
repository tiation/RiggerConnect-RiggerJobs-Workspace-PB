'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to sign in:', error);
      // Handle error (show toast notification, etc.)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-backgroundPrimary to-backgroundSecondary">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-textPrimary text-center mb-8">
            Welcome to RiggerHire
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-textPrimary mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-backgroundSecondary text-textPrimary border border-gray-700 focus:outline-none focus:border-primaryCyan"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-textPrimary mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-backgroundSecondary text-textPrimary border border-gray-700 focus:outline-none focus:border-primaryCyan"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-primaryCyan to-primaryMagenta text-textPrimary font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
