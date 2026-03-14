import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Courses from './pages/Courses'
import Community from './pages/Community'
import Channels from './pages/Channels'
import Announcements from './pages/Announcements'
import MyCourses from './pages/MyCourses'
import LearnerSignup from './pages/LearnerSignup'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import AdminSignup from './pages/AdminSignup'
import AdminCourses from './pages/AdminCourses'
import AdminCreateCourse from './pages/AdminCreateCourse'
import AdminEditCourse from './pages/AdminEditCourse'
import AppShell from './components/AppShell'
import AdminProtectedRoute from './components/AdminProtectedRoute'
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
        <Route
          path="/my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />
        <Route path="/community" element={<Community />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/learner" element={<LearnerSignup />} />
        <Route path="/signup/instructor" element={<AdminSignup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/admin" element={<Navigate to="/instructor/courses" replace />} />
        <Route path="/admin/signup" element={<Navigate to="/signup/instructor" replace />} />
        <Route path="/admin/signin" element={<Navigate to="/signin" replace />} />
        <Route path="/instructor" element={<Navigate to="/instructor/courses" replace />} />
        <Route
          path="/instructor/courses"
          element={
            <AdminProtectedRoute>
              <AdminCourses />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/instructor/courses/new"
          element={
            <AdminProtectedRoute>
              <AdminCreateCourse />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/instructor/courses/:courseId/edit"
          element={
            <AdminProtectedRoute>
              <AdminEditCourse />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </AppShell>
  )
}

export default App
