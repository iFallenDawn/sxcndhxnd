import db from "@/firebase/firestore"
import { collection, doc, addDoc, getDoc, getDocs, setDoc } from "firebase/firestore"
import validation from "@/data/validation"
import { commissionData } from "."

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
  async addCommission(reqBody) {
    const newCommission = validation.validateCommissionFields(reqBody)
    const commissionCollection = collection(db, "commissions")
    const docRef = await addDoc(commissionCollection, newCommission)
    if (!docRef) throw `Error: Failed to add user`
    return await this.getCommissionById(docRef.id)
  },
  // nixon fill these out, if need help on put vs patch google or reference advanced-api-blog-nextjs/src/data/posts.js
  // PUT - update a resource, REPLACE the entire resource with new data.
  // PATCH - update a resource, update some fields in the resource IN PLACE.

  async updateCommissionPut(id, updatedCommission) {
    id = validation.checkId(id)
    let updatedCommissionData = validation.validateCommissionFields(updatedCommission)
    const commissionExists = await this.getCommissionById(id)
    if (!commissionExists) throw 'Commission not found'
    const commissionsCollection = collection(db, "commissions")
    const docRef = doc(commissionsCollection, id)
    if (!docRef) throw `Error: Failed to update user PUT`
    await setDoc(docRef, updatedCommissionData)

    return await this.getCommissionById(docRef.id)
  },
  async updateCommissionPatch(id, updatedCommission) {

  },
  async deleteCommission(id) {
    // get the document
    // delete the document
    // return the deleted document
  }
}

export default exportedMethods
