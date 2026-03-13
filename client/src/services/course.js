import api from './api'

export async function getCoursePreview() {
  const response = await api.get('/course/preview')
  return response.data.courses ?? []
}
