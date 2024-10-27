import { NextResponse } from 'next/server'
import validation from '@/utils/validation'
import db from '@/utils/firestore'
import { collection } from 'firebase/firestore'

export async function POST(request) {

}

const validation = require('../utils/validation');
// firestore db
const dbCollections = require('../config/firebase')
const db = dbCollections.db

async function createUser(firstName, lastName, username, password, email, socialMediaHandles) {
  // validation here

  // check if they exist
  const users = db.collection('users')
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    password: password,
    email: email,
    socialMediaHandles: socialMediaHandles
  }
  const insertInfo = await users.add(newUser)
  if (!insertInfo) throw 'Error: Could not add user';
  return {userInserted: true};
}

module.exports = {
  createUser
}