import { Link, useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { authAtom } from '../state/authAtom'
import { enrolledCoursesAtom } from '../state/enrolledCoursesAtom'
import { profileAtom } from '../state/profileAtom'
import { clearLearnerSession } from '../state/sessionActions'

export default function TopNav() {
  const navigate = useNavigate()
  const [auth] = useAtom(authAtom)
  const [profile] = useAtom(profileAtom)
  const [, setEnrolledCourses] = useAtom(enrolledCoursesAtom)

  function handleSignout() {
    clearLearnerSession()
    setEnrolledCourses([])
    navigate('/')
  }

  return (
    <header className="h-14 border-b border-gray-800 bg-gray-950/95 backdrop-blur">
      <div className="h-full px-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">CourseCommons</p>
          {auth.isLoggedIn && profile && (
            <p className="text-xs text-gray-400">
              Signed in as {profile.firstName} {profile.lastName}
            </p>
          )}
        </div>
        <nav className="flex items-center gap-5 text-sm">
          <Link to="/" className="text-blue-400 hover:text-blue-300">Home</Link>
          <Link to="/courses" className="text-blue-400 hover:text-blue-300">Courses</Link>
          <Link to="/community" className="text-blue-400 hover:text-blue-300">Community</Link>
          <Link to="/channels" className="text-blue-400 hover:text-blue-300">Channels</Link>
          <Link to="/announcements" className="text-blue-400 hover:text-blue-300">Announcements</Link>
          {auth.isLoggedIn ? (
            <button
              type="button"
              onClick={handleSignout}
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
        </nav>
      </div>
    </header>
  )
}
