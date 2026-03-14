import axios from 'axios'
import { clearAdminSession } from '../state/sessionActions'

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const hasAuthHeader = Boolean(error.config?.headers?.Authorization)

    if (hasAuthHeader && (status === 401 || status === 403)) {
      clearAdminSession()

      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname

        if (currentPath !== '/signin' && currentPath !== '/signup' && currentPath !== '/signup/instructor') {
          window.location.assign('/signin')
        }
      }
    }

    return Promise.reject(error)
  },
)

export default adminApi