import { Navigate, useLocation } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { authAtom } from '../state/authAtom'

export default function ProtectedRoute({ children }) {
  const auth = useAtomValue(authAtom)
  const location = useLocation()

  if (!auth.isLoggedIn) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  }

  return children
}
