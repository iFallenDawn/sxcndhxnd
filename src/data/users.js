import db from "@/firebase/firestore"
import firebaseApp from '@/firebase/firebase'
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where } from "firebase/firestore"
import { getAuth, updateEmail } from 'firebase/auth'
import validation from "@/data/validation"

let exportedMethods = {
  async getUserById(id) {
    id = validation.checkId(id)
    const docRef = doc(db, "users", id)
    const user = await getDoc(docRef)
    if (!user.exists()) throw `User with id '${id}' not found`
    return {
      id: docRef.id,
      ...user.data()
    }
  },
  // mainly used to check if there's a user with that email that exists
  async getUserByEmail(email) {
    email = validation.checkEmail(email)
    const userCollection = collection(db, 'users')
    const q = query(userCollection, where("email", "==", email))
    const querySnapshot = await getDocs(q)
    //there should only be one since emails are unique. for createUser throw an error there instead so this will work with the API
    if (querySnapshot.empty) return
    const docRef = querySnapshot.docs[0]
    return {
      id: docRef.id,
      ...docRef.data()
    }
  },
  async getAllUsers() {
    const querySnapshot = await getDocs(collection(db, 'users'))
    if (querySnapshot.empty) throw `There are no users in the collection`
    const userList = querySnapshot.docs.map((doc) => doc.data())
    return userList
  },
  async createUser(reqBody, firebaseAuthId) {
    //account for the case where we're sending an api call in directly to make
    //a user versus with firebase auth
    firebaseAuthId = validation.checkString(firebaseAuthId)
    const newUser = validation.validateUserFields(reqBody)
    const emailExists = await this.getUserByEmail(reqBody.email)
    if (emailExists) throw `email ${reqBody.email} already exists`
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
    if (!user) throw `User is not signed in!`
    const updatedEmail = await updateEmail(currentUser, newEmail)

  },
  async updateUserPut(id, updatedUser) {
    id = validation.checkId(id)
    let updatedUserData = validation.validateUserFields(updatedUser)
    const userExists = await this.getUserById(id)
    if (!userExists) throw `User with id '${id}' not found`
    const usersCollection = collection(db, "users")
    const docRef = doc(usersCollection, id)
    if (!docRef) throw `Failed to update user with id '${id}' PUT`
    await setDoc(docRef, updatedUserData)
    return await this.getUserById(docRef.id)
  },
  async updateUserPatch(id, updatedUser) {
    id = validation.checkId(id)
    const updatedUserData = {}
    const userExists = await this.getUserById(id)
    if (!userExists) throw `User with id '${id}' not found`
    for (const [key, value] of Object.entries(updatedUser)) {
      if (validation.validateUserKey(key)) {
        const userArrayData = ['commissionIds', 'productIds']
        if (userArrayData.includes(key)) {
          updatedUserData[key] = validation.checkStringArray(value, key)
        }
        else {
          updatedUserData[key] = validation.checkString(value, key)
        }
      }
    }
    const usersCollection = collection(db, "users")
    const docRef = doc(usersCollection, id)
    if (!docRef) throw `Failed to update user with id '${id}' PATCH`
    await setDoc(docRef, updatedUserData, { merge: true })
    return await this.getUserById(docRef.id)
  },
  async deleteUser(id) {
    id = validation.checkId(id)
    const userExists = await this.getUserById(id)
    if (!userExists) throw `User with id '${id}' not found`
    const usersCollection = collection(db, 'users')
    const docRef = doc(usersCollection, id)
    if (!docRef) throw `Failed to delete user with id '${id}'`
    await deleteDoc(docRef)
    return userExists
  },
  async getPasswordErrors(password) {
    let errors = []
    const auth = getAuth(firebaseApp)
    const status = await validatePassword(auth, password)
    if (!status.isValid) {
      if (!status.containsLowercaseLetter)
        errors.push('Password requires at least one lowercase letter')
      if (!status.containsUppercaseLetter)
        errors.push('Password requires at least one uppercase character')
      if (!status.containsNonAlphanumericCharacter)
        errors.push('Password requires at least one special character')
      if (!status.containsNumericCharacter)
        errors.push('Password requires at least one number')
      if (!status.meetsMinPasswordLength)
        errors.push('Password needs to contain at least 8 characters')
    }
    return errors
  }
}

export default exportedMethods