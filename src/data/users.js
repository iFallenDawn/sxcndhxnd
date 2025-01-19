import db from "@/firebase/firestore"
import firebaseApp from '@/firebase/firebase'
import { collection, doc, addDoc, getDoc, getDocs, setDoc, deleteDoc, query, where } from "firebase/firestore"
import { getAuth, updateEmail } from 'firebase/auth'
import validation from "@/data/validation"

let exportedMethods = {
  async getUserById(id) {
    id = validation.checkId(id)
    const docRef = doc(db, "users", id)
    const user = await getDoc(docRef)
    if (!user.exists()) throw `Error: User with id '${id}' not found`
    return {
      id: docRef.id,
      ...user.data()
    }
  },
  async getUserByEmail(email) {
    email = validation.checkEmail(email)
    const userCollection = collection(db, 'users')
    const q = query(userCollection, where("email", "==", email))
    const querySnapshot = await getDocs(q)
    //there should only be one since emails are unique. for createUser throw an error there instead so this will work with the API
    if (querySnapshot.empty) throw `Error: Could not find user with email ${email}`
    const docRef = querySnapshot.docs[0]
    return {
      id: docRef.id,
      ...docRef.data()
    }
  },
  async getAllUsers() {
    const querySnapshot = await getDocs(collection(db, 'users'))
    if (querySnapshot.empty) throw `Error: There are no users in the collection`
    const userList = querySnapshot.docs.map((doc) => doc.data())
    return userList
  },
  async createUser(reqBody, firebaseAuthId) {
    //account for the case where we're sending an api call in directly to make
    //a user versus with firebase auth
    firebaseAuthId = validation.checkString(firebaseAuthId)
    const newUser = validation.validateUserFields(reqBody)
    const emailExists = await this.getUserByEmail(reqBody.email)
    if (emailExists) throw `Error: email ${reqBody.email} already exists`
    //we have to use setDoc here because we're matching Firebase Auth id
    await setDoc(doc(db, "users", firebaseAuthId), newUser)
    return await this.getUserById(firebaseAuthId)

  },
  //requires user to be signed in first!
  async updateUserEmail(id, newEmail) {
    id = validation.checkId(id)
    newEmail = validation.checkEmail(newEmail)
    const auth = getAuth(firebaseApp)
    const currentUser = auth.currentUser
    if (!user) throw `Error: User is not signed in!`
    const updatedEmail = await updateEmail(currentUser, newEmail)

  },
  async updateUserByPut() {

  },
  async deleteUser(id) {

  }
}

export default exportedMethods