import { atom } from 'jotai'

export const authAtom = atom({
  token: localStorage.getItem('token') ?? null,
  isLoggedIn: Boolean(localStorage.getItem('token')),
})
