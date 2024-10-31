import { NextResponse } from 'next/server'
import validation from '@/utils/validation'
import db from '@/config/firestore'
import { collection, addDoc, getDoc } from 'firebase/firestore'

export async function POST(req) {
  let reqBody = null
  try {
    reqBody = await req.json()
    if (!reqBody || Object.keys(reqBody).length === 0) {
      return NextResponse.json(
        {error: 'There are no fields in the request body'},
        {status: 400}
      );
    }
    // check all the variables
    try {
      reqBody.firstName = validation.checkString(reqBody.firstName, 'First Name')
    } catch (e) {
      return NextResponse.json({error: e}, {status: 400});
    }

    try {
      const newCommission = {
        firstName: reqBody.firstName
      }
      // https://firebase.google.com/docs/firestore/manage-data/add-data
      const commissions = collection(db, 'commissions')
      const docRef = await addDoc(commissions, newCommission)
      // https://firebase.google.com/docs/firestore/query-data/get-data#web_6
      const insertedCommission = await getDoc(docRef)
      const commissionData = insertedCommission.data()
      return NextResponse.json(commissionData, {status: 200});
    } catch (e) {
      return NextResponse.json({error: e}, {status: 500})
    }

  } catch (e) {
    return NextResponse.json(
      {error: 'There is no request body'},
      {status: 400}
    ) 
  }
}


// async function createUser(firstName, lastName, username, password, email, socialMediaHandles) {
//   // validation here

//   // check if they exist
//   const users = db.collection('users')
//   let newUser = {
//     firstName: firstName,
//     lastName: lastName,
//     username: username,
//     password: password,
//     email: email,
//     socialMediaHandles: socialMediaHandles
//   }
//   const insertInfo = await users.add(newUser)
//   if (!insertInfo) throw 'Error: Could not add user';
//   return {userInserted: true};
// }

// module.exports = {
//   createUser
// }