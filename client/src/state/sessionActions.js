import { appStore } from './store'
import { authAtom } from './authAtom'
import { enrolledCoursesAtom } from './enrolledCoursesAtom'
import { profileAtom } from './profileAtom'

export function clearLearnerSession() {
  localStorage.removeItem('token')
  appStore.set(authAtom, { token: null, isLoggedIn: false })
  appStore.set(profileAtom, null)
  appStore.set(enrolledCoursesAtom, [])
}
