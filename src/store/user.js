import { create } from 'zustand'

export const userStore = create((set) => ({
  isLoggedIn: '',
  user: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    instagram: '',
    commissionIds: [],
    productIds: []
  },
  updateUser: (newUser) => set((state) => ({
    user: { ...newUser }
  }))
}))