'use server'
import validation from '@/data/validation'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { commissionData } from '@/data'

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