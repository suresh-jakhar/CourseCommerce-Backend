import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminCourseForm from '../components/AdminCourseForm'
import { createAdminCourse } from '../services/admin'

function getCourseSaveError(err) {
  return err.response?.data?.message || 'Unable to save this course right now.'
}

export default function AdminCreateCourse() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(course) {
    setError('')
    setIsSubmitting(true)

    try {
      const response = await createAdminCourse(course)
      navigate('/instructor/courses', {
        replace: true,
        state: { notice: response.message || 'Course created successfully.' },
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
        <h1 className="text-4xl font-bold text-white">Create a new course</h1>
        <p className="max-w-2xl text-sm leading-6 text-gray-300">
          Set up the course metadata, pricing model, and cover image learners will see in the catalog.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
        <AdminCourseForm
          submitLabel="Create course"
          isSubmitting={isSubmitting}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>

      <Link to="/instructor/courses" className="mt-6 inline-flex text-sm font-medium text-blue-400 hover:text-blue-300">
        Back to all courses
      </Link>
    </section>
  )
}