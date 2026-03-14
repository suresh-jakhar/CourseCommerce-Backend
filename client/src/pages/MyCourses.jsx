import { useEffect, useState } from 'react'
import { getMyCourses } from '../services/course'

function getErrorMessage(err) {
  const status = err.response?.status
  const apiMessage = err.response?.data?.message

  if (status === 401 || status === 403) {
    return 'Your session is invalid or expired. Please sign in again.'
  }

  return apiMessage || 'Unable to load your courses right now.'
}

export default function MyCourses() {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadMyCourses() {
      try {
        const enrolledCourses = await getMyCourses()

        if (!isMounted) {
          return
        }

        setCourses(enrolledCourses)
        setError('')
      } catch (err) {
        if (!isMounted) {
          return
        }

        setError(getErrorMessage(err))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMyCourses()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center px-6 py-16">
        <p className="text-lg text-gray-300">Loading your courses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-full items-center justify-center px-6 py-16">
        <div className="max-w-md text-center">
          <h1 className="mb-3 text-3xl font-bold text-white">My Courses</h1>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="flex min-h-full items-center justify-center px-6 py-16">
        <div className="max-w-md text-center">
          <h1 className="mb-3 text-3xl font-bold text-white">My Courses</h1>
          <p className="text-gray-300">You have not enrolled in any courses yet.</p>
        </div>
      </div>
    )
  }

  return (
    <section className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Courses</h1>
        <p className="mt-2 text-sm text-gray-400">Courses you are currently enrolled in.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
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
                <h2 className="text-xl font-semibold text-white">{course.title}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-300">{course.description}</p>
              </div>

              <p className="text-sm font-medium text-emerald-300">Enrolled</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
