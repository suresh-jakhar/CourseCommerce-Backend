import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { adminSignup } from '../services/admin'
import { adminAuthAtom } from '../state/adminAuthAtom'
import { authAtom } from '../state/authAtom'

export default function AdminSignup() {
  const navigate = useNavigate()
  const instructorAuth = useAtomValue(adminAuthAtom)
  const learnerAuth = useAtomValue(authAtom)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (instructorAuth.isLoggedIn) {
    return <Navigate to="/instructor/courses" replace />
  }

  if (learnerAuth.isLoggedIn) {
    return <Navigate to="/" replace />
  }

  function handleChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await adminSignup(form)
      navigate('/signin', {
        replace: true,
        state: { notice: 'Instructor account created. Sign in to manage your courses.' },
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Instructor signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">Instructor account</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Create your instructor account</h1>
          <p className="mt-2 text-sm text-gray-400">
            Want to learn instead?{' '}
            <Link to="/signup/learner" className="text-blue-400 hover:text-blue-300">
              Sign up as a learner
            </Link>
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-gray-300">
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
                placeholder="Jane"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-gray-300">
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
                placeholder="Teacher"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-300">
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
              placeholder="teacher@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-300">
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
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create instructor account'}
          </button>
        </form>
      </div>
    </div>
  )
}