import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { authAtom } from '../state/authAtom'
import { profileAtom } from '../state/profileAtom'
import { getProfile } from '../services/auth'
import { clearLearnerSession } from '../state/sessionActions'

export default function SessionBootstrap() {
  const [auth] = useAtom(authAtom)
  const [profile, setProfile] = useAtom(profileAtom)

  useEffect(() => {
    let isMounted = true

    async function bootstrapSession() {
      if (!auth.isLoggedIn || profile) {
        return
      }

      try {
        const user = await getProfile()

        if (isMounted) {
          setProfile(user)
        }
      } catch {
        if (isMounted) {
          clearLearnerSession()
        }
      }
    }

    bootstrapSession()

    return () => {
      isMounted = false
    }
  }, [auth.isLoggedIn, profile, setProfile])

  return null
}
