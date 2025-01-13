import db from "@/firebase/firestore"
import { collection, doc, addDoc, getDoc, getDocs, setDoc, deleteDoc } from "firebase/firestore"
import validation from "@/data/validation"

let exportedMethods = {
  async getUserById(id) {

  },
  async getAllUsers(id) {

  },
  async createUser() {

  },
  async updateUserEmail(userId, password, newEmail) {

  },
  async updateUserByPut() {

  },
  async deleteUser(id) {

  }
}

export default exportedMethods