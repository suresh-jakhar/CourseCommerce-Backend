import { atom } from 'jotai'

export const adminAuthAtom = atom({
  token: localStorage.getItem('adminToken') ?? null,
  email: localStorage.getItem('adminEmail') ?? '',
  isLoggedIn: Boolean(localStorage.getItem('adminToken')),
})