'use client'

import { useUserContext } from '@/context/UserContext'

const Account = (props) => {
  const { user } = useUserContext()
  console.log(user)
  return (
    <>
      <h1>account</h1>
      {(user && user.id) ? (
        <h1>{user.id}</h1>
      ) : (
        <h1>User is not logged in</h1>
      )}
    </>
  )
}

export default Account