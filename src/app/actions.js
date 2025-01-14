'use server'
import validation from '@/data/validation'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { commissionData } from '@/data'
import firebaseApp from '@/firebase/firebase'
import { getAuth, createUserWithEmailAndPassword, validatePassword } from 'firebase/auth'

// these are all server actions
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
// server actions DIRECTLY call the firebase functions, don't need to make api calls
// ONLY used for POST functionality

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
      console.log("hello world")
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
    password: 'Password'
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
  const status = await validatePassword(auth, formData.get('password'))
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

  let success = false
  if (errors.length > 0) {
    return { message: errors }
  }
  else {
    try {
      // create the user
      const createFirebaseUser = await createUserWithEmailAndPassword(auth, newUser.email, formData.get('password'))
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