import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen pt-24 bg-background-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-primary text-transparent bg-clip-text text-center">
            Sign In
          </h1>

          <div className="bg-background-darker p-8 rounded-lg border border-primary-cyan">
            <LoginForm />

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-300 text-center">
                Don&apos;t have an account?{' '}
                <a href="/register" className="text-primary-cyan hover:text-primary-magenta transition-colors">
                  Register now
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
