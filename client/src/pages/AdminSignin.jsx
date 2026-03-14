import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { adminSignin } from '../services/admin'
import { adminAuthAtom } from '../state/adminAuthAtom'

export default function AdminSignin() {
  const navigate = useNavigate()
  const location = useLocation()
  const adminAuth = useAtomValue(adminAuthAtom)
  const setAdminAuth = useSetAtom(adminAuthAtom)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (adminAuth.isLoggedIn) {
    return <Navigate to="/admin/courses" replace />
  }

  function handleChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const data = await adminSignin(form)
      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminEmail', form.email)
      setAdminAuth({ token: data.token, email: form.email, isLoggedIn: true })

      const destination = location.state?.from || '/admin/courses'
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Admin sign in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">Admin access</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Sign in to manage your courses</h1>
          <p className="mt-2 text-sm text-gray-400">
            Need an admin account?{' '}
            <Link to="/admin/signup" className="text-blue-400 hover:text-blue-300">
              Create one
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              placeholder="Your password"
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
            {isLoading ? 'Signing in...' : 'Sign in as admin'}
          </button>
        </form>
      </div>
    </div>
  )
}