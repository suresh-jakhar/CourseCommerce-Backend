import TopNav from './TopNav'
import Sidebar from './Sidebar'
import SessionBootstrap from './SessionBootstrap'

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SessionBootstrap />
      <TopNav />
      <div className="flex min-h-[calc(100vh-56px)]">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
