import { Navigate, useLocation } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { adminAuthAtom } from '../state/adminAuthAtom'

export default function AdminProtectedRoute({ children }) {
  const adminAuth = useAtomValue(adminAuthAtom)
  const location = useLocation()

  if (!adminAuth.isLoggedIn) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  }

  return children
}