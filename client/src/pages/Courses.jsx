import { useEffect, useState } from 'react'
import { enrollInCourse, getCoursePreview, getMyCourses, purchaseCourse } from '../services/course'

function getActionErrorMessage(err, fallbackMessage) {
  const status = err.response?.status
  const apiMessage = err.response?.data?.message

  if (status === 401 || status === 403) {
    return 'Your session is invalid or expired. Please sign in again.'
  }

  return apiMessage || fallbackMessage
}

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [courseActions, setCourseActions] = useState({})

  useEffect(() => {
    let isMounted = true

    async function loadCourses() {
      try {
        const previewCourses = await getCoursePreview()
        const enrolledCourses = await getMyCourses().catch(() => [])

        if (!isMounted) {
          return
        }

        setCourses(previewCourses)
        const enrolledCourseIds = new Set(enrolledCourses.map((course) => String(course._id)))
        const initialActions = {}

        previewCourses.forEach((course) => {
          if (enrolledCourseIds.has(String(course._id))) {
            initialActions[course._id] = {
              status: 'enrolled',
              type: 'success',
              message: 'Already enrolled in this course',
            }
          }
        })

        setCourseActions(initialActions)
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
    setCourseActions((prev) => ({
      ...prev,
      [courseId]: {
        status: 'enrolling',
        type: 'info',
        message: 'Enrolling in course...',
      },
    }))

    try {
      const data = await enrollInCourse(courseId)

      if (data.alreadyEnrolled) {
        setCourseActions((prev) => ({
          ...prev,
          [courseId]: {
            status: 'already_enrolled',
            type: 'success',
            message: data.message || 'Already enrolled in this course',
          },
        }))

        return
      }

      if (data.paymentRequired) {
        setCourseActions((prev) => ({
          ...prev,
          [courseId]: {
            status: 'purchase_required',
            type: 'info',
            message: data.message || 'Payment required before enrollment is complete.',
          },
        }))

        return
      }

      setCourseActions((prev) => ({
        ...prev,
        [courseId]: {
          status: 'enrolled',
          type: 'success',
          message: data.message || 'Enrolled successfully.',
        },
      }))
    } catch (err) {
      const apiStatus = err.response?.status

      setCourseActions((prev) => ({
        ...prev,
        [courseId]: {
          status: apiStatus === 409 ? 'already_enrolled' : 'idle',
          type: 'error',
          message: getActionErrorMessage(err, 'Unable to enroll right now.'),
        },
      }))
    }
  }

  async function handlePurchase(courseId) {
    setCourseActions((prev) => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] || {}),
        status: 'purchasing',
        type: 'info',
        message: 'Purchasing course...',
      },
    }))

    try {
      const data = await purchaseCourse(courseId)

      if (data.alreadyEnrolled) {
        setCourseActions((prev) => ({
          ...prev,
          [courseId]: {
            status: 'already_enrolled',
            type: 'success',
            message: data.message || 'Already enrolled in this course',
          },
        }))

        return
      }

      setCourseActions((prev) => ({
        ...prev,
        [courseId]: {
          status: 'enrolled',
          type: 'success',
          message: data.message || 'Course purchased and enrolled successfully.',
        },
      }))
    } catch (err) {
      const apiStatus = err.response?.status

      setCourseActions((prev) => ({
        ...prev,
        [courseId]: {
          status: apiStatus === 409 ? 'already_enrolled' : 'purchase_required',
          type: 'error',
          message: getActionErrorMessage(err, 'Unable to purchase this course right now.'),
        },
      }))
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

              {(() => {
                const action = courseActions[course._id] || { status: 'idle' }

                if (action.status === 'enrolled' || action.status === 'already_enrolled') {
                  return (
                    <button
                      type="button"
                      disabled
                      className="w-full rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300"
                    >
                      Enrolled
                    </button>
                  )
                }

                if (action.status === 'purchase_required' || action.status === 'purchasing') {
                  return (
                    <button
                      type="button"
                      onClick={() => handlePurchase(course._id)}
                      disabled={action.status === 'purchasing'}
                      className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {action.status === 'purchasing' ? 'Purchasing...' : 'Purchase'}
                    </button>
                  )
                }

                return (
                  <button
                    type="button"
                    onClick={() => handleEnroll(course._id)}
                    disabled={action.status === 'enrolling'}
                    className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {action.status === 'enrolling' ? 'Enrolling...' : 'Enroll'}
                  </button>
                )
              })()}

              {courseActions[course._id]?.message && (
                <p
                  className={`text-sm ${
                    courseActions[course._id].type === 'error'
                      ? 'text-red-300'
                      : courseActions[course._id].type === 'info'
                        ? 'text-amber-300'
                        : 'text-emerald-300'
                  }`}
                >
                  {courseActions[course._id].message}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
