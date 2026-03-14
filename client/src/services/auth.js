import api from './api'

export async function signup({ email, password, firstName, lastName }) {
  const response = await api.post('/user/signup', { email, password, firstName, lastName })
  return response.data
}
