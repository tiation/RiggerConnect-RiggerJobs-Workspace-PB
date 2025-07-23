import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type SignInInputs = z.infer<typeof signInSchema>

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInputs>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInInputs) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      router.push(callbackUrl)
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-background-card p-6 rounded-lg border border-border-dark">
        <div>
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-primary-neon to-secondary-neon text-transparent bg-clip-text">
            Sign in to your account
          </h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md bg-background-dark border-border-dark text-text-primary shadow-sm focus:border-primary-neon focus:ring-primary-neon min-h-touch"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className="mt-1 block w-full rounded-md bg-background-dark border-border-dark text-text-primary shadow-sm focus:border-primary-neon focus:ring-primary-neon min-h-touch"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded min-h-touch bg-background-dark hover:bg-background-hover border border-primary-neon text-primary-neon hover:shadow-neon transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <a
            href="/auth/signup"
            className="text-primary-neon hover:text-primary-hover transition-colors"
          >
            Don't have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  )
}
