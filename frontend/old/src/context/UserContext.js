'use client'

import { createContext, useState, useContext } from 'react'

//create context doesn't hold any information, just returns a Context object
const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  console.log("hi: " + user)

  //we call Context.Provider and set the value to specify what values are in that context
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext)