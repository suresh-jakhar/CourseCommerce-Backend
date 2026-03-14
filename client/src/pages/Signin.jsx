import { useState } from 'react'
import { useNavigate, Link, Navigate, useLocation } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { adminSignin } from '../services/admin'
import { getProfile, signin } from '../services/auth'
import { adminAuthAtom } from '../state/adminAuthAtom'
import { authAtom } from '../state/authAtom'
import { profileAtom } from '../state/profileAtom'
import { enrolledCoursesAtom } from '../state/enrolledCoursesAtom'
import { clearAdminSession, clearLearnerSession } from '../state/sessionActions'

function getSigninErrorMessage(userError, instructorError) {
  const instructorMessage = instructorError?.response?.data?.message
  const userMessage = userError?.response?.data?.message

  if (instructorMessage === 'Invalid password' || userMessage === 'Invalid password') {
    return 'Invalid password'
  }

  if (instructorMessage === 'Admin not found' && userMessage === 'User not found') {
    return 'No account found for this email'
  }

  return userMessage || instructorMessage || 'Sign in failed. Please try again.'
}

export default function Signin() {
  const navigate = useNavigate()
  const location = useLocation()
  const learnerAuth = useAtomValue(authAtom)
  const instructorAuth = useAtomValue(adminAuthAtom)
  const setAuth = useSetAtom(authAtom)
  const setInstructorAuth = useSetAtom(adminAuthAtom)
  const setProfile = useSetAtom(profileAtom)
  const setEnrolledCourses = useSetAtom(enrolledCoursesAtom)
  const [form, setForm] = useState({ email: '', password: '' })
  const [notice] = useState(location.state?.notice || '')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (instructorAuth.isLoggedIn) {
    return <Navigate to="/instructor/courses" replace />
  }

  if (learnerAuth.isLoggedIn) {
    return <Navigate to="/" replace />
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    clearLearnerSession()
    clearAdminSession()
    setEnrolledCourses([])

    try {
      const instructorData = await adminSignin(form)
      localStorage.setItem('adminToken', instructorData.token)
      localStorage.setItem('adminEmail', form.email)
      setInstructorAuth({ token: instructorData.token, email: form.email, isLoggedIn: true })
      navigate('/instructor/courses', { replace: true })
    } catch (instructorError) {
      try {
        const data = await signin(form)
        localStorage.setItem('token', data.token)
        setAuth({ token: data.token, isLoggedIn: true })
        const user = await getProfile()
        setProfile(user)
        navigate('/', { replace: true })
      } catch (userError) {
        setError(getSigninErrorMessage(userError, instructorError))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-400">
            We will route you to the right dashboard automatically.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300">
              Sign up
            </Link>
          </p>
        </div>

        {notice && (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {notice}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              placeholder="Your password"
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
            {isLoading ? 'Signing in...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
