import { useLocation } from 'react-router-dom'
import TopNav from './TopNav'
import Sidebar from './Sidebar'
import SessionBootstrap from './SessionBootstrap'

export default function AppShell({ children }) {
  const location = useLocation()
  const hideSidebar = ['/signin', '/signup', '/signup/learner', '/signup/instructor'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SessionBootstrap />
      <TopNav />
      <div className="flex min-h-[calc(100vh-56px)]">
        {!hideSidebar && <Sidebar />}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
