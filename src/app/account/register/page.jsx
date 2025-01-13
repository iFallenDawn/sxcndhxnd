import { useActionState } from "react";
'use client'
import { createUser } from '@/app/actions'
const initialState = {
  message: null
}


const Register = () => {
  const [state, formAction] = useActionState(createUser, initialState)

  return (
    <form action={formAction} className='flex flex-col'>
      {state && state.message && (
        <ul
          aria-live='polite'
          // className={`sr-only`}
          role='status'
        >
          {state.message.map((msg, index) => {
            console.log(msg)
            return (
              <li className='error' key={index}>
                {msg}
              </li>
            );
          })}
        </ul>
      )}
      <label>
        First Name:
        <input type="text" name="firstName" />
      </label>
      <label>
        Last Name:
        <input type="text" name="lastName" />
      </label>
      <label>
        Email:
        <input type="text" name="email" />
      </label>
      <label>
        Password:
        <input type="password" name="password" />
      </label>
      {/* something about social media handles here */}
      <button>Submit</button>
    </form>
  )
}

export default Register