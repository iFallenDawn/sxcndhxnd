import db from '@/config/firestore'
import { collection, doc, addDoc, getDoc } from 'firebase/firestore'
import validation from '@/data/validation'

let exportedMethods = {
  async getCommissionById(id) {
    id = validation.checkId(id)
    // https://firebase.google.com/docs/firestore/query-data/get-data#web_6
    const docRef = doc(db, 'commissions', id)
    const commission = await getDoc(docRef)
    if (!commission) throw `Error: User not found`
    return commission.data()
  },
  async addCommission(firstName, lastName, email, commissionType, pieceVision, symmetryType, baseMaterial, colors, fabrics, shapePatterns, distress, retailor, pockets, weeklyChecks, extra) {
    firstName = validation.checkString(firstName, 'First Name')
    lastName = validation.checkString(lastName, 'Last Name')
    email = validation.checkString(email, 'Email')
    commissionType = validation.checkString(commissionType, 'Commission Type')
    pieceVision = validation.checkString(pieceVision, 'Piece Vision')
    symmetryType = validation.checkString(symmetryType, 'Symmetry Type')
    baseMaterial = validation.checkString(baseMaterial, 'Base Material')
    colors = validation.checkString(colors, 'Colors')
    fabrics = validation.checkString(fabrics, 'Fabrics')
    shapePatterns = validation.checkString(shapePatterns, 'Shape Patterns')
    distress = validation.checkString(distress, 'Distress')
    retailor = validation.checkString(retailor, 'Retailor')
    pockets = validation.checkString(pockets, 'Pockets')
    weeklyChecks = validation.checkString(weeklyChecks, 'Weekly Checks')
    extra = validation.checkString(extra, 'Extra')

    const newCommission = {
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
    // https://firebase.google.com/docs/firestore/manage-data/add-data
    const commissions = collection(db, 'commissions')
    const docRef = await addDoc(commissions, newCommission)
    if (!docRef) throw `Error: Failed to add user`
    return await this.getCommissionById(docRef.id)
  }
}

export default exportedMethods