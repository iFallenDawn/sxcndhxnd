'use server'
import validation from '@/data/validation'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// these are all server actions
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
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
  for (const [key, value] of Object.entries(newCommission)) {
    try {
      let keyFormData = formData.get(key)
      keyFormData = validation.checkString(keyFormData, value)
      // why do we use commissionFields instead of newCommission?
      commissionFields[key] = keyFormData
    } catch (e) {
      errors.push(e)
    }
  }
  let success = false
  let errors = []

  if (errors.length > 0) {
    return { message: errors }
  }
  else {
    try {
      // create the new commission
      await fetch('/api/commissions', {
        method: 'POST',
        body: JSON.stringify(newCommission)
      })
    } catch (e) {
      return { message: e }
    } finally {
      if (success) {
        console.log('wow we created a commission')
      }
    }
  }

  // console.log(firstName)
  // console.log(lastName)
  // console.log(email)
  // console.log(commissionType)
  // console.log(pieceVision)
  // console.log(symmetryType)
  // console.log(baseMaterial)
  // console.log(creativeControl)
  // console.log(colors)
  // console.log(fabrics)
  // console.log(shapePatterns)
  // console.log(distress)
  // console.log(retailor)
  // console.log(pockets)
  // console.log(weeklyChecks)
  // console.log(extra)
}