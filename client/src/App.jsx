import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Courses from './pages/Courses'

function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="flex gap-6 p-4 border-b border-gray-800">
        <Link to="/" className="text-blue-400 hover:text-blue-300">Home</Link>
        <Link to="/courses" className="text-blue-400 hover:text-blue-300">Courses</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
    </div>
  )
}

export default App
