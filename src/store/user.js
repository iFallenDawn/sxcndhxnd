import { create } from 'zustand'
import { getAuth } from '@firebase/auth'
import firebaseApp from '@/firebase/firebase'

const auth = getAuth(firebaseApp)

const userStore = create((set) => ({
  isLoggedIn: auth.currentUser !== null,
  loginError: '',
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

export default userStore