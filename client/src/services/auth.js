import api from './api'

export async function signup({ email, password, firstName, lastName }) {
  const response = await api.post('/user/signup', { email, password, firstName, lastName })
  return response.data
}

export async function signin({ email, password }) {
  const response = await api.post('/user/signin', { email, password })
  return response.data
}

export async function getProfile() {
  const response = await api.get('/user/profile')
  return response.data.user
}
