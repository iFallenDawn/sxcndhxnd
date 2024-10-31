import db from "@/firebase/firestore"
import { collection, doc, addDoc, getDoc, getDocs } from "firebase/firestore"
import validation from "@/data/validation"

let exportedMethods = {
  // for querying https://firebase.google.com/docs/firestore/query-data/get-data#web_6
  async getCommissionById(id) {
    id = validation.checkId(id)
    const docRef = doc(db, "commissions", id)
    const commission = await getDoc(docRef)
    if (!commission) throw `Error: User not found`
    return commission.data()
  },
  async getAllCommissions() {
    const querySnapshot = await getDocs(collection(db, 'commissions'))
    if (!querySnapshot) throw `Error: Could not get all commissions`
    const commissionList = querySnapshot.docs.map((doc) => doc.data())
    return commissionList
  },
  // adding and setting data https://firebase.google.com/docs/firestore/manage-data/add-data
  async addCommission(firstName, lastName, email, commissionType, pieceVision, symmetryType, baseMaterial, colors, fabrics, shapePatterns, distress, retailor, pockets, weeklyChecks, extra) {
    firstName = validation.checkString(firstName, "First Name")
    lastName = validation.checkString(lastName, "Last Name")
    email = validation.checkString(email, "Email")
    commissionType = validation.checkString(commissionType, "Commission Type")
    pieceVision = validation.checkString(pieceVision, "Piece Vision")
    symmetryType = validation.checkString(symmetryType, "Symmetry Type")
    baseMaterial = validation.checkString(baseMaterial, "Base Material")
    colors = validation.checkString(colors, "Colors")
    fabrics = validation.checkString(fabrics, "Fabrics")
    shapePatterns = validation.checkString(shapePatterns, "Shape Patterns")
    distress = validation.checkString(distress, "Distress")
    retailor = validation.checkString(retailor, "Retailor")
    pockets = validation.checkString(pockets, "Pockets")
    weeklyChecks = validation.checkString(weeklyChecks, "Weekly Checks")
    extra = validation.checkString(extra, "Extra")

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
      extra: extra,
    }

    const commissions = collection(db, "commissions")
    const docRef = await addDoc(commissions, newCommission)
    if (!docRef) throw `Error: Failed to add user`
    return await this.getCommissionById(docRef.id)
  },
  // nixon fill these out
  async updateCommissionPatch(id, firstName, lastName, email, commissionType, pieceVision, symmetryType, baseMaterial, colors, fabrics, shapePatterns, distress, retailor, pockets, weeklyChecks, extra) {

  },
  async updateCommissionPost(id, firstName, lastName, email, commissionType, pieceVision, symmetryType, baseMaterial, colors, fabrics, shapePatterns, distress, retailor, pockets, weeklyChecks, extra) {

  },
  async deleteCommission(id) {

  }
}

export default exportedMethods
