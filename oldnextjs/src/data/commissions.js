import db from "@/firebase/firestore"
import { collection, doc, addDoc, getDoc, getDocs, setDoc, deleteDoc } from "firebase/firestore"
import validation from "@/data/validation"

let exportedMethods = {

  // for querying https://firebase.google.com/docs/firestore/query-data/get-data#web_6
  async getCommissionById(id) {
    id = validation.checkId(id)
    const docRef = doc(db, "commissions", id)
    const commission = await getDoc(docRef)
    if (!commission.exists()) throw `Commission with id '${id}' not found`
    return {
      id: docRef.id,
      ...commission.data()
    }
  },
  async getAllCommissions() {
    const querySnapshot = await getDocs(collection(db, 'commissions'))
    if (querySnapshot.empty) throw `There are no commissions in the collection`
    const commissionList = querySnapshot.docs.map((doc) => doc.data())
    return commissionList
  },
  // adding and setting data https://firebase.google.com/docs/firestore/manage-data/add-data
  async createCommission(reqBody) {
    const newCommission = validation.validateCommissionFields(reqBody)
    const commissionCollection = collection(db, "commissions")
    const docRef = await addDoc(commissionCollection, newCommission)
    if (!docRef) throw `Failed to create commission`
    return await this.getCommissionById(docRef.id)
  },
  async updateCommissionPut(id, updatedCommission) {
    id = validation.checkId(id)
    let updatedCommissionData = validation.validateCommissionFields(updatedCommission)
    const commissionExists = await this.getCommissionById(id)
    if (!commissionExists) throw `Commission with id '${id}' not found`
    const commissionsCollection = collection(db, "commissions")
    const docRef = doc(commissionsCollection, id)
    if (!docRef) throw `Failed to update commission with id '${id}' PUT`
    await setDoc(docRef, updatedCommissionData)
    return await this.getCommissionById(docRef.id)
  },
  async updateCommissionPatch(id, updatedCommission) {
    id = validation.checkId(id)
    const updatedCommissionData = {}
    const commissionExists = await this.getCommissionById(id)
    if (!commissionExists) throw `Commission with id '${id}' not found`
    // if field in updatedCommission exists, validate and store in updatedCommissionData. do for all fields
    for (const [key, value] of Object.entries(updatedCommission)) {
      if (validation.validateCommissionKey(key)) {
        updatedCommissionData[key] = validation.checkString(value, key)
      }
    }
    // update in firebase
    const commissionsCollection = collection(db, "commissions")
    const docRef = doc(commissionsCollection, id)
    if (!docRef) throw `Failed to update commission with id '${id}' PATCH`
    await setDoc(docRef, updatedCommissionData, { merge: true })
    return await this.getCommissionById(docRef.id)
  },
  async deleteCommission(id) {
    id = validation.checkId(id)
    // get the document
    const commissionExists = await this.getCommissionById(id)
    if (!commissionExists) throw `Commission with id '${id}' not found`
    // delete the document
    const commissionsCollection = collection(db, 'commissions')
    const docRef = doc(commissionsCollection, id)
    if (!docRef) throw `Failed to delete commission with id '${id}'`
    // return the deleted document
    await deleteDoc(docRef)
    return commissionExists
  }
}

export default exportedMethods
