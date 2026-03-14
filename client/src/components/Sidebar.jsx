import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="w-56 border-r border-gray-800 bg-gray-900/40 p-4 hidden sm:block">
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
    </aside>
  )
}
