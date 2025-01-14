import db from "@/firebase/firestore"
import { collection, doc, addDoc, getDoc, getDocs, setDoc, deleteDoc } from "firebase/firestore"
import validation from "@/data/validation"

let exportedMethods = {
  async getUserById(id) {
    id = validation.checkId(id)
    const docRef = doc(db, "users", id)
    const user = await getDoc(docRef)
    if (!user) throw `Error: User not found`
    return {
      id: docRef.id,
      ...user.data()
    }
  },
  async getAllUsers(id) {
    const querySnapshot = await getDocs(collection(db, 'users'))
    if (!querySnapshot) throw `Error: Could not get all users`
    const userList = querySnapshot.docs.map((doc) => doc.data())
    return userList
  },
  async createUser(reqBody) {

  },
  async updateUserEmail(userId, password, newEmail) {

  },
  async updateUserByPut() {

  },
  async deleteUser(id) {

  }
}

export default exportedMethods