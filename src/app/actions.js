'use server'
import validation from '@/data/validation'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// these are all server actions
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
export async function createCommission(prevState, formData) {
  let firstName, lastName, email, commissionType, pieceVision, symmetryType, baseMaterial, colors, fabrics, shapePatterns, distress, retailor, pockets, weeklyChecks, extra = null
  let id = null
  let success = false
  let errors = []
  firstName = formData.get('firstName')
  lastName = formData.get('lastName')
  email = formData.get('email')
  commissionType = formData.get('commissionType')
  pieceVision = formData.get('pieceVision')
  symmetryType = formData.get('symmetryType')
  baseMaterial = formData.get('baseMaterial')
  colors = formData.get('colors')
  fabrics = formData.get('fabrics')
  shapePatterns = formData.get('shapePatterns')
  distress = formData.get('distress')
  retailor = formData.get('retailor')
  pockets = formData.get('pockets')
  weeklyChecks = formData.get('weeklyChecks')
  extra = formData.get('extra')

  // check that the user input values are valid
  try {
    firstName = validation.checkString(firstName, 'First Name')
  } catch (e) {
    errors.push(e)
  }
    
  try {
    lastName = validation.checkString(lastName, 'Last Name')
  } catch (e) {
    errors.push(e)
  }

  try {
    email = validation.checkString(email, 'Email')
  } catch (e) {
    errors.push(e)
  }

  try {
    commissionType = validation.checkString(commissionType, 'Commission Type')
  } catch (e) {
    errors.push(e)
  }

  try {
    pieceVision = validation.checkString(pieceVision, 'Piece Vision')
  } catch (e) {
    errors.push(e)
  }

  try {
    symmetryType = validation.checkString(symmetryType, 'Symmetry Type')
  } catch (e) {
    errors.push(e)
  }

  try {
    baseMaterial = validation.checkString(baseMaterial, 'Base Material')
  } catch (e) {
    errors.push(e)
  }

  try {
    colors = validation.checkString(colors, 'Colors')
  } catch (e) {
    errors.push(e)
  }

  try {
    fabrics = validation.checkString(fabrics, 'Fabrics')
  } catch (e) {
    errors.push(e)
  }

  try {
    shapePatterns = validation.checkString(shapePatterns, 'Shape Patterns')
  } catch (e) {
    errors.push(e)
  }

  try {
    distress = validation.checkString(distress, 'Distress')
  } catch (e) {
    errors.push(e)
  }

  try {
    retailor = validation.checkString(retailor, 'Retailor')
  } catch (e) {
    errors.push(e)
  }

  try {
    pockets = validation.checkString(pockets, 'Pockets')
  } catch (e) {
    errors.push(e)
  }

  try {
    weeklyChecks = validation.checkString(weeklyChecks, 'Weekly Checks')
  } catch (e) {
    errors.push(e)
  }

  try {
    extra = validation.checkString(extra, 'Extra')
  } catch (e) {
    errors.push(e)
  }

  let newCommission = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    commissionType: commissionType,
    pieceVision: pieceVision,
    symmetryType: symmetryType,
    baseMaterial: baseMaterial,
    colors: colors,
    fabrics: fabrics,
    shapePatterns: shapePatterns,
    distress: distress,
    retailor: retailor,
    pockets: pockets,
    weeklyChecks: weeklyChecks,
    extra: extra
  }

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
  // console.log(colors)
  // console.log(fabrics)
  // console.log(shapePatterns)
  // console.log(distress)
  // console.log(retailor)
  // console.log(pockets)
  // console.log(weeklyChecks)
  // console.log(extra)
}