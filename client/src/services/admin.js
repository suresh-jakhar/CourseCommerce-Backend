import adminApi from './adminApi'

export async function adminSignup({ email, password, firstName, lastName }) {
  const response = await adminApi.post('/admin/signup', { email, password, firstName, lastName })
  return response.data
}

export async function adminSignin({ email, password }) {
  const response = await adminApi.post('/admin/signin', { email, password })
  return response.data
}

export async function getAdminCourses() {
  const response = await adminApi.get('/admin/course/bulk')
  return response.data.courses ?? []
}

export async function createAdminCourse(course) {
  const response = await adminApi.post('/admin/course/create', course)
  return response.data
}

export async function updateAdminCourse(courseId, course) {
  const response = await adminApi.put(`/admin/course/update/${courseId}`, course)
  return response.data
}

export async function deleteAdminCourse(courseId) {
  const response = await adminApi.delete(`/admin/course/delete/${courseId}`)
  return response.data
}