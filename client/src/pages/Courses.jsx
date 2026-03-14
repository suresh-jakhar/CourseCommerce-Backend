import { useEffect, useState } from 'react'
import { enrollInCourse, getCoursePreview } from '../services/course'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [enrollingCourseId, setEnrollingCourseId] = useState('')
  const [courseFeedback, setCourseFeedback] = useState({})

  useEffect(() => {
    let isMounted = true

    async function loadCourses() {
      try {
        const previewCourses = await getCoursePreview()

        if (!isMounted) {
          return
        }

        setCourses(previewCourses)
        setError('')
      } catch (err) {
        if (!isMounted) {
          return
        }

        setError(err.response?.data?.message || 'Unable to load courses right now.')
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

  async function handleEnroll(courseId) {
    setEnrollingCourseId(courseId)
    setCourseFeedback((prev) => ({
      ...prev,
      [courseId]: null,
    }))

    try {
      const data = await enrollInCourse(courseId)
      setCourseFeedback((prev) => ({
        ...prev,
        [courseId]: {
          type: data.paymentRequired ? 'info' : 'success',
          message: data.message || 'Enrollment request completed.',
        },
      }))
    } catch (err) {
      setCourseFeedback((prev) => ({
        ...prev,
        [courseId]: {
          type: 'error',
          message: err.response?.data?.message || 'Unable to enroll right now.',
        },
      }))
    } finally {
      setEnrollingCourseId('')
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center px-6 py-16">
        <p className="text-lg text-gray-300">Loading courses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-full items-center justify-center px-6 py-16">
        <div className="max-w-md text-center">
          <h1 className="mb-3 text-3xl font-bold text-white">Courses</h1>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="flex min-h-full items-center justify-center px-6 py-16">
        <div className="max-w-md text-center">
          <h1 className="mb-3 text-3xl font-bold text-white">Courses</h1>
          <p className="text-gray-300">No courses are available yet.</p>
        </div>
      </div>
    )
  }

  return (
    <section className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Courses</h1>
        <p className="mt-2 text-sm text-gray-400">Preview the currently available courses.</p>
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

              <p className="text-sm font-medium text-blue-300">
                {course.isFree ? 'Free' : `Price: $${course.price}`}
              </p>

              <button
                type="button"
                onClick={() => handleEnroll(course._id)}
                disabled={enrollingCourseId === course._id}
                className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {enrollingCourseId === course._id ? 'Enrolling...' : 'Enroll'}
              </button>

              {courseFeedback[course._id] && (
                <p
                  className={`text-sm ${
                    courseFeedback[course._id].type === 'error'
                      ? 'text-red-300'
                      : courseFeedback[course._id].type === 'info'
                        ? 'text-amber-300'
                        : 'text-emerald-300'
                  }`}
                >
                  {courseFeedback[course._id].message}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
