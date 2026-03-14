import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Courses from './pages/Courses'
import Community from './pages/Community'
import Channels from './pages/Channels'
import Announcements from './pages/Announcements'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import AppShell from './components/AppShell'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route path="/community" element={<Community />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </AppShell>
  )
}

export default App
