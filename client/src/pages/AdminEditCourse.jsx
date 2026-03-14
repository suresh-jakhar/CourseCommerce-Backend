import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminCourseForm from '../components/AdminCourseForm'
import { getAdminCourses, updateAdminCourse } from '../services/admin'

function getCourseSaveError(err) {
  return err.response?.data?.message || 'Unable to save this course right now.'
}

export default function AdminEditCourse() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadCourse() {
      try {
        const courses = await getAdminCourses()
        const matchedCourse = courses.find((item) => item._id === courseId)

        if (!isMounted) {
          return
        }

        if (!matchedCourse) {
          setError('Course not found in your admin catalog.')
          return
        }

        setCourse({
          title: matchedCourse.title,
          description: matchedCourse.description,
          imageUrl: matchedCourse.imageUrl,
          price: String(matchedCourse.price ?? 0),
          isFree: Boolean(matchedCourse.isFree),
        })
      } catch (err) {
        if (!isMounted) {
          return
        }

        setError(getCourseSaveError(err))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadCourse()

    return () => {
      isMounted = false
    }
  }, [courseId])

  async function handleSubmit(updatedCourse) {
    setError('')
    setIsSubmitting(true)

    try {
      const response = await updateAdminCourse(courseId, updatedCourse)
      navigate('/instructor/courses', {
        replace: true,
        state: { notice: response.message || 'Course updated successfully.' },
      })
    } catch (err) {
      setError(getCourseSaveError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="px-6 py-8 lg:px-10">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">Admin workspace</p>
        <h1 className="text-4xl font-bold text-white">Edit course</h1>
        <p className="max-w-2xl text-sm leading-6 text-gray-300">
          Update course details and pricing without leaving the admin workspace.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
        {isLoading ? (
          <p className="text-sm text-gray-300">Loading course details...</p>
        ) : course ? (
          <AdminCourseForm
            initialValues={course}
            submitLabel="Save changes"
            isSubmitting={isSubmitting}
            error={error}
            onSubmit={handleSubmit}
          />
        ) : (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error || 'Course not found.'}
          </p>
        )}
      </div>

      <Link to="/instructor/courses" className="mt-6 inline-flex text-sm font-medium text-blue-400 hover:text-blue-300">
        Back to all courses
      </Link>
    </section>
  )
}