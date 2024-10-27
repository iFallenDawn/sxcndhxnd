import { NextResponse } from 'next/server'
// import validation from '@/utils/validation'
// import db from '@/utils/firestore'
// import { collection } from 'firebase/firestore'

export async function POST(req) {
  console.log('we made it')
  let reqBody = await req.json()
  console.log(reqBody)
  return NextResponse.json(reqBody, {status: 200});
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