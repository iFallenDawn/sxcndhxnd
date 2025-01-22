'use client'
import { useFormState } from 'react-dom'
import { loginUser } from '@/app/actions'
const initialState = {
  message: null
}

const Login = () => {
  const [state, formAction] = useFormState(loginUser, initialState)
  return (
    <form action={formAction} className='flex flex-col'>
      {state && state.message && !Array.isArray(state.message) && (
        <h1 className='error'>{state.message}</h1>
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
      <h1>Login</h1>
      <label>
        Email:
        <input type="text" name="email" />
      </label>
      <label>
        Password:
        <input type="Password" name="password" />
      </label>
      <button>Submit</button>
    </form>
  )
}

export default Login