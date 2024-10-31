import { NextResponse } from 'next/server'
import validation from '@/utils/validation'
import db from '@/utils/firestore'
import { collection } from 'firebase/firestore'

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
    console.log(reqBody)
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
      const commissions = db.collection('commissions')
      await commissions.add(newCommission)
      return NextResponse.json(newCommission, {status: 200});
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