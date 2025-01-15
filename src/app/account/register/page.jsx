'use client'
import { useFormState } from 'react-dom'
import { createUser } from '@/app/actions'
const initialState = {
  message: null
}

const Register = (props) => {
  const [state, formAction] = useFormState(createUser, initialState)

  return (
    <form action={formAction} className='flex flex-col'>
      {state && state.message && !Array.isArray(state.message) && (
        <h1>{state.message}</h1>
      )}
      {state && state.message && Array.isArray(state.message) && (
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
        <input type="Password" name="password" />
      </label>
      <label>
        Instagram:
        <input type="text" name="instagram" />
      </label>
      <button>Submit</button>
    </form>
  )
}

export default Register