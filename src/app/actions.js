'use server'
import validation from '@/data/validation'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { commissionData, userData } from '@/data'
import firebaseApp from '@/firebase/firebase'
import { getAuth, createUserWithEmailAndPassword, validatePassword, signInWithEmailAndPassword } from 'firebase/auth'

// these are all server actions
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
// server actions DIRECTLY call the firebase functions, don't need to make api calls
// ONLY used for POST functionality

async function getPasswordErrors(password) {
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

export async function createCommission(prevState, formData) {
  // we set the values as the parameter we're checking in checkstring to make it easier to view errors
  let newCommission = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    commissionType: 'Commission Type',
    pieceVision: 'Piece Vision',
    symmetryType: 'Symmetry Type',
    baseMaterial: 'Base Material',
    creativeControl: 'Creative Control',
    colors: 'Colors',
    fabrics: 'Fabrics',
    shapePatterns: 'Shape Patterns',
    distress: 'Distress',
    retailor: 'Retailor',
    pockets: 'Pockets',
    weeklyChecks: 'Weekly Checks',
    extra: 'Extra'
  }
  let errors = []
  for (const [key, value] of Object.entries(newCommission)) {
    try {
      let keyFormData = formData.get(key)
      keyFormData = validation.checkString(keyFormData, value)
      newCommission[key] = keyFormData
    } catch (e) {
      errors.push(e)
    }
  }
  let success = false

  if (errors.length > 0) {
    return { message: errors }
  }
  else {
    try {
      // create the new commission
      const createdCommission = await commissionData.createCommission(newCommission)
      success = true
    } catch (e) {
      return { message: e }
    } finally {
      if (success) {
        return { message: 'Commission submitted!' }
      }
    }
  }
}

export async function createUser(prevState, formData) {
  let newUser = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    password: 'Password',
    instagram: 'Instagram'
  }
  let errors = []
  for (const [key, value] of Object.entries(newUser)) {
    try {
      if (key !== 'password') {
        let keyFormData = formData.get(key)
        if (key === 'email')
          keyFormData = validation.checkEmail(keyFormData, value)
        else
          keyFormData = validation.checkString(keyFormData, value)
        newUser[key] = keyFormData
      }
    } catch (e) {
      errors.push(e)
    }
  }
  const auth = getAuth(firebaseApp)
  let passwordErrors = await getPasswordErrors(formData.get('password'))
  errors = errors.concat(errors, passwordErrors)
  let success = false
  if (errors.length > 0) {
    console.log(errors)
    return { message: errors }
  }
  else {
    //create user in firebase auth
    let firebaseAuthId = ''
    try {
      const createFirebaseUser = await createUserWithEmailAndPassword(auth, newUser.email, formData.get('password'))
      firebaseAuthId = createFirebaseUser.user.uid
    } catch (e) {
      //https://firebase.google.com/docs/auth/admin/errors
      let error = 'Unknown error'
      if (e.code === 'auth/email-already-in-use')
        error = 'This email already has an account!'
      else if (e.code === 'auth/invalid-email')
        error = 'Invalid email'
      else if (e.code === 'auth/weak-password')
        error = 'Password is too weak'
      return { message: error }
    }
    try {
      // create the user in firestore collection
      const createdUser = await userData.createUser(newUser, firebaseAuthId)
      success = true
    } catch (e) {
      return { message: e }
    } finally {
      if (success) {
        return { message: 'User created!' }
      }
    }
  }
}

export async function loginUser(prevState, formData) {
  let email = formData.get('email')
  let password = formData.get('password')
  let errors = []
  try {
    email = validation.checkEmail(email)
  } catch (e) {
    errors.push(e)
  }
  const auth = getAuth(firebaseApp)
  let passwordErrors = await getPasswordErrors(formData.get('password'))
  errors = errors.concat(errors, passwordErrors)
  let success = false
  if (errors.length > 0) {
    return { message: errors }
  }
  else {
    //log the user in with firebase auth
    let firebaseAuthId = ''
    try {
      const loginFirebaseUser = await signInWithEmailAndPassword(auth, email, password)
      firebaseAuthId = loginFirebaseUser.user.uid
      success = true
    } catch (e) {
      // https://firebase.google.com/docs/reference/node/firebase.auth.Auth#signinwithemailandpassword
      let error = 'Unknown error'
      if (e.code === 'auth/invalid-email')
        error = 'This email is not valid'
      if (e.code === 'auth/user-disabled')
        error = 'This email has been disabled'
      if (e.code === 'auth/user-not-found')
        error = 'There is no user with this email'
      if (e.code === 'auth/wrong-password')
        error = 'Invalid password'
      if (e.code === 'auth/invalid-credential')
        error = 'Invalid credentials'
      return { message: error }
    }
    try {
      const loggedUserData = await userData.getUserById(firebaseAuthId)
      //need to get this data into zustand store somehow...
    } catch (e) {
      return { message: e }
    } finally {
      if (success) {
        return { message: 'User logged in!' }
      }
    }
  }
}