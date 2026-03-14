import axios from 'axios'
import { clearLearnerSession } from '../state/sessionActions'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const hasAuthHeader = Boolean(error.config?.headers?.Authorization)

    if (hasAuthHeader && (status === 401 || status === 403)) {
      clearLearnerSession()

      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname

        if (currentPath !== '/signin' && currentPath !== '/signup') {
          window.location.assign('/signin')
        }
      }
    }

    return Promise.reject(error)
  },
)

export default api
