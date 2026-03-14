import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAtom, useAtomValue } from 'jotai'
import { adminAuthAtom } from '../state/adminAuthAtom'
import { authAtom } from '../state/authAtom'
import { enrolledCoursesAtom } from '../state/enrolledCoursesAtom'
import { profileAtom } from '../state/profileAtom'
import { clearAdminSession, clearLearnerSession } from '../state/sessionActions'

export default function TopNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [auth] = useAtom(authAtom)
  const [profile] = useAtom(profileAtom)
  const [, setEnrolledCourses] = useAtom(enrolledCoursesAtom)
  const instructorAuth = useAtomValue(adminAuthAtom)
  const isInstructorRoute = location.pathname.startsWith('/instructor') || location.pathname.startsWith('/admin')

  function handleLearnerSignout() {
    clearLearnerSession()
    setEnrolledCourses([])
    navigate('/')
  }

  function handleInstructorSignout() {
    clearAdminSession()
    navigate('/signin')
  }

  return (
    <header className="h-14 border-b border-gray-800 bg-gray-950/95 backdrop-blur">
      <div className="h-full px-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{isInstructorRoute ? 'CourseCommons Instructor' : 'CourseCommons'}</p>
          {isInstructorRoute ? (
            instructorAuth.isLoggedIn && (
              <p className="text-xs text-gray-400">
                Instructor session active{instructorAuth.email ? ` for ${instructorAuth.email}` : ''}
              </p>
            )
          ) : (
            auth.isLoggedIn && profile && (
            <p className="text-xs text-gray-400">
              Signed in as {profile.firstName} {profile.lastName}
            </p>
            )
          )}
        </div>
        <nav className="flex items-center gap-5 text-sm">
          {isInstructorRoute ? (
            <>
              {instructorAuth.isLoggedIn ? (
                <>
                  <Link to="/instructor/courses" className="text-blue-400 hover:text-blue-300">My Courses</Link>
                  <Link to="/instructor/courses/new" className="text-blue-400 hover:text-blue-300">Create</Link>
                </>
              ) : (
                <>
                  <Link to="/" className="text-blue-400 hover:text-blue-300">Home</Link>
                  <Link to="/courses" className="text-blue-400 hover:text-blue-300">Courses</Link>
                </>
              )}
              {instructorAuth.isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleInstructorSignout}
                  className="ml-4 rounded-lg border border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Sign out
                </button>
              ) : (
                <>
                  <Link to="/signup" className="ml-4 rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-400">Sign up</Link>
                  <Link to="/signin" className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white">Sign in</Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/" className="text-blue-400 hover:text-blue-300">Home</Link>
              <Link to="/courses" className="text-blue-400 hover:text-blue-300">Courses</Link>
              <Link to="/community" className="text-blue-400 hover:text-blue-300">Community</Link>
              <Link to="/channels" className="text-blue-400 hover:text-blue-300">Channels</Link>
              <Link to="/announcements" className="text-blue-400 hover:text-blue-300">Announcements</Link>
              {auth.isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLearnerSignout}
                  className="ml-4 rounded-lg border border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Sign out
                </button>
              ) : (
                <>
                  <Link to="/signup" className="ml-4 rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-400">Sign up</Link>
                  <Link to="/signin" className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white">Sign in</Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
