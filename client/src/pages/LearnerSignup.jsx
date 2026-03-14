import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { signup } from '../services/auth'
import { adminAuthAtom } from '../state/adminAuthAtom'
import { authAtom } from '../state/authAtom'

export default function LearnerSignup() {
  const navigate = useNavigate()
  const learnerAuth = useAtomValue(authAtom)
  const instructorAuth = useAtomValue(adminAuthAtom)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (learnerAuth.isLoggedIn) {
    return <Navigate to="/" replace />
  }

  if (instructorAuth.isLoggedIn) {
    return <Navigate to="/instructor/courses" replace />
  }

  function handleChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await signup(form)
      navigate('/signin', {
        replace: true,
        state: { notice: 'Learner account created. Sign in to continue.' },
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">Learner account</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Create your learner account</h1>
          <p className="mt-2 text-sm text-gray-400">
            Want to teach instead?{' '}
            <Link to="/signup/instructor" className="text-blue-400 hover:text-blue-300">
              Sign up as an instructor
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1.5">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                minLength={2}
                value={form.firstName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                placeholder="John"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1.5">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                minLength={2}
                value={form.lastName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create learner account'}
          </button>
        </form>
      </div>
    </div>
  )
}