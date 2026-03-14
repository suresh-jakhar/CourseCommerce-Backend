import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { deleteAdminCourse, getAdminCourses } from '../services/admin'

function getAdminCoursesErrorMessage(err) {
  return err.response?.data?.message || 'Unable to load your courses right now.'
}

function formatPrice(course) {
  if (course.isFree) {
    return 'Free'
  }

  return `$${Number(course.price || 0).toFixed(2)}`
}

export default function AdminCourses() {
  const location = useLocation()
  const [courses, setCourses] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(location.state?.notice || '')
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadCourses() {
      try {
        const adminCourses = await getAdminCourses()

        if (!isMounted) {
          return
        }

        setCourses(adminCourses)
        setError('')
      } catch (err) {
        if (!isMounted) {
          return
        }

        setError(getAdminCoursesErrorMessage(err))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadCourses()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleDelete(courseId) {
    const confirmed = window.confirm('Delete this course? This action cannot be undone.')

    if (!confirmed) {
      return
    }

    setDeletingId(courseId)
    setError('')
    setNotice('')

    try {
      const response = await deleteAdminCourse(courseId)
      setCourses((prev) => prev.filter((course) => course._id !== courseId))
      setNotice(response.message || 'Course deleted successfully.')
    } catch (err) {
      setError(getAdminCoursesErrorMessage(err))
    } finally {
      setDeletingId('')
    }
  }

  const freeCourseCount = courses.filter((course) => course.isFree).length
  const paidCourseCount = courses.length - freeCourseCount

  return (
    <section className="px-6 py-8 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">Admin workspace</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Manage your course catalog</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300">
            Create, update, and retire the courses you publish on CourseCommons.
          </p>
        </div>

        <Link
          to="/instructor/courses/new"
          className="inline-flex rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-400"
        >
          Create course
        </Link>
      </div>

      {(notice || error) && (
        <div
          className={`mb-6 rounded-2xl px-5 py-4 text-sm ${
            error
              ? 'border border-red-500/30 bg-red-500/10 text-red-300'
              : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
          }`}
        >
          {error || notice}
        </div>
      )}

      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5">
          <p className="text-sm text-gray-400">Total courses</p>
          <p className="mt-3 text-3xl font-semibold text-white">{courses.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5">
          <p className="text-sm text-gray-400">Free courses</p>
          <p className="mt-3 text-3xl font-semibold text-white">{freeCourseCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5">
          <p className="text-sm text-gray-400">Paid courses</p>
          <p className="mt-3 text-3xl font-semibold text-white">{paidCourseCount}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-8 text-sm text-gray-300">
          Loading your admin courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-8">
          <h2 className="text-2xl font-semibold text-white">No courses published yet</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300">
            Start by creating your first course. You can make it free or paid and edit it later.
          </p>
          <Link
            to="/instructor/courses/new"
            className="mt-6 inline-flex rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-400"
          >
            Create your first course
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {courses.map((course) => (
            <article key={course._id} className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/60">
              {course.imageUrl ? (
                <img src={course.imageUrl} alt={course.title} className="h-52 w-full object-cover" />
              ) : (
                <div className="flex h-52 items-center justify-center bg-gray-800 text-sm text-gray-400">
                  No image available
                </div>
              )}

              <div className="space-y-5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{course.title}</h2>
                    <p className="mt-2 text-sm text-gray-400">{formatPrice(course)}</p>
                  </div>
                  <span className="rounded-full border border-gray-700 px-3 py-1 text-xs uppercase tracking-wide text-gray-300">
                    {course.isFree ? 'Free' : 'Paid'}
                  </span>
                </div>

                <p className="text-sm leading-6 text-gray-300">{course.description}</p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/instructor/courses/${course._id}/edit`}
                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:text-white"
                  >
                    Edit course
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(course._id)}
                    disabled={deletingId === course._id}
                    className="rounded-lg border border-red-500/40 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === course._id ? 'Deleting...' : 'Delete course'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}