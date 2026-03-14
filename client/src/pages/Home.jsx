import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { Link } from 'react-router-dom'
import { authAtom } from '../state/authAtom'
import { profileAtom } from '../state/profileAtom'
import { enrolledCoursesAtom } from '../state/enrolledCoursesAtom'
import { getMyCourses } from '../services/course'

function getDashboardErrorMessage(err) {
  const status = err.response?.status
  const apiMessage = err.response?.data?.message

  if (status === 401 || status === 403) {
    return 'Your session expired. Please sign in again.'
  }

  return apiMessage || 'Unable to load your learner dashboard right now.'
}

export default function Home() {
  const [auth] = useAtom(authAtom)
  const [profile] = useAtom(profileAtom)
  const [enrolledCourses, setEnrolledCourses] = useAtom(enrolledCoursesAtom)
  const [isLoadingCourses, setIsLoadingCourses] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDashboardCourses() {
      if (!auth.isLoggedIn) {
        if (isMounted) {
          setError('')
          setIsLoadingCourses(false)
        }
        return
      }

      try {
        if (isMounted) {
          setIsLoadingCourses(true)
        }

        const courses = await getMyCourses()

        if (!isMounted) {
          return
        }

        setEnrolledCourses(courses)
        setError('')
      } catch (err) {
        if (!isMounted) {
          return
        }

        setError(getDashboardErrorMessage(err))
      } finally {
        if (isMounted) {
          setIsLoadingCourses(false)
        }
      }
    }

    loadDashboardCourses()

    return () => {
      isMounted = false
    }
  }, [auth.isLoggedIn, setEnrolledCourses])

  if (!auth.isLoggedIn) {
    return (
      <section className="px-6 py-10 lg:px-10">
        <div className="max-w-4xl space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
              Learner Dashboard
            </p>
            <h1 className="text-4xl font-bold text-white">Track courses, progress, and your learner session in one place.</h1>
            <p className="max-w-2xl text-base leading-7 text-gray-300">
              Sign in to view your enrolled courses, restore your learner session, and continue where you left off.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/signin" className="rounded-lg bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-400">
              Sign in
            </Link>
            <Link to="/signup" className="rounded-lg border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-200 hover:text-white">
              Create account
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5">
              <p className="text-sm text-gray-400">Protected courses</p>
              <p className="mt-3 text-2xl font-semibold text-white">Secure access</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5">
              <p className="text-sm text-gray-400">Learner state</p>
              <p className="mt-3 text-2xl font-semibold text-white">Synced across pages</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5">
              <p className="text-sm text-gray-400">Session recovery</p>
              <p className="mt-3 text-2xl font-semibold text-white">Handled cleanly</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!profile || isLoadingCourses) {
    return (
      <div className="flex min-h-full items-center justify-center px-6 py-16">
        <p className="text-lg text-gray-300">Loading your learner dashboard...</p>
      </div>
    )
  }

  const latestCourses = enrolledCourses.slice(0, 3)

  return (
    <section className="px-6 py-8 lg:px-10">
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">Dashboard</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Welcome back, {profile.firstName}.</h1>
          <p className="mt-3 text-base text-gray-300">Signed in as {profile.email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/courses" className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-400">
            Browse courses
          </Link>
          <Link to="/my-courses" className="rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-200 hover:text-white">
            View my courses
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-300">
          {error}
        </div>
      )}

      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5">
          <p className="text-sm text-gray-400">Learner</p>
          <p className="mt-3 text-xl font-semibold text-white">{profile.firstName} {profile.lastName}</p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5">
          <p className="text-sm text-gray-400">Enrolled courses</p>
          <p className="mt-3 text-3xl font-semibold text-white">{enrolledCourses.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5">
          <p className="text-sm text-gray-400">Session</p>
          <p className="mt-3 text-xl font-semibold text-emerald-300">Active</p>
        </div>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-8">
          <h2 className="text-2xl font-semibold text-white">No enrolled courses yet</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300">
            Start by browsing the available catalog. Once you enroll, your learner dashboard will show your active courses here.
          </p>
          <Link to="/courses" className="mt-6 inline-flex rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-400">
            Explore courses
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold text-white">Continue learning</h2>
            <p className="mt-2 text-sm text-gray-400">Your most recent enrolled courses are ready below.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {latestCourses.map((course) => (
              <article
                key={course._id}
                className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/60"
              >
                {course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gray-800 text-sm text-gray-400">
                    No image available
                  </div>
                )}

                <div className="space-y-4 p-5">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-300">{course.description}</p>
                  </div>

                  <p className="text-sm font-medium text-emerald-300">Enrolled</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
