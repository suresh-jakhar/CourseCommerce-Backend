import { Link, Navigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { adminAuthAtom } from '../state/adminAuthAtom'
import { authAtom } from '../state/authAtom'

export default function Signup() {
  const learnerAuth = useAtomValue(authAtom)
  const instructorAuth = useAtomValue(adminAuthAtom)

  if (learnerAuth.isLoggedIn) {
    return <Navigate to="/" replace />
  }

  if (instructorAuth.isLoggedIn) {
    return <Navigate to="/instructor/courses" replace />
  }

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-4xl space-y-10">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">Choose account type</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Sign up as a learner or instructor</h1>
          <p className="mt-2 text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            to="/signup/learner"
            className="rounded-3xl border border-gray-800 bg-gray-900/60 p-8 transition hover:border-blue-500/60 hover:bg-gray-900"
          >
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">Learner</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Join to enroll and keep learning</h2>
            <p className="mt-3 text-sm leading-6 text-gray-300">
              Create a learner account to browse courses, enroll, and track your learning dashboard.
            </p>
            <span className="mt-6 inline-flex text-sm font-semibold text-blue-300">Continue as learner</span>
          </Link>

          <Link
            to="/signup/instructor"
            className="rounded-3xl border border-gray-800 bg-gray-900/60 p-8 transition hover:border-blue-500/60 hover:bg-gray-900"
          >
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">Instructor</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Create and manage your own courses</h2>
            <p className="mt-3 text-sm leading-6 text-gray-300">
              Set up an instructor account to publish, edit, and manage your course catalog.
            </p>
            <span className="mt-6 inline-flex text-sm font-semibold text-blue-300">Continue as instructor</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
