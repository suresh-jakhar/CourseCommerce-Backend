import { Link, useLocation } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { adminAuthAtom } from '../state/adminAuthAtom'

export default function Sidebar() {
  const location = useLocation()
  const instructorAuth = useAtomValue(adminAuthAtom)
  const isInstructorRoute = location.pathname.startsWith('/instructor') || location.pathname.startsWith('/admin')

  return (
    <aside className="w-56 border-r border-gray-800 bg-gray-900/40 p-4 hidden sm:block">
      {isInstructorRoute ? (
        <>
          <p className="mb-3 text-xs uppercase tracking-wide text-gray-400">Instructor</p>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>
              <Link to="/instructor/courses" className="hover:text-blue-300">Course Catalog</Link>
            </li>
            {instructorAuth.isLoggedIn ? (
              <li>
                <Link to="/instructor/courses/new" className="hover:text-blue-300">Create Course</Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/signin" className="hover:text-blue-300">Sign In</Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-blue-300">Choose Account Type</Link>
                </li>
              </>
            )}
          </ul>
        </>
      ) : (
        <>
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">Sidebar</p>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>
              <Link to="/" className="hover:text-blue-300">Dashboard</Link>
            </li>
            <li>
              <Link to="/my-courses" className="hover:text-blue-300">My Courses</Link>
            </li>
            <li>
              <Link to="/community" className="hover:text-blue-300">Community</Link>
            </li>
            <li>
              <Link to="/channels" className="hover:text-blue-300">Channels</Link>
            </li>
            <li>
              <Link to="/announcements" className="hover:text-blue-300">Announcements</Link>
            </li>
          </ul>
        </>
      )}
    </aside>
  )
}
