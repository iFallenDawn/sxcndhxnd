'use client'
import { useState } from 'react'
import validation from '@/data/validation'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginSuccessful, setLoginSuccessful] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmail = (e) => setEmail(e.target.value)
  const handlePassword = (e) => setPassword(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await validation.checkEmail(email)
      await validation.checkPassword(password)
      //call api

      //update store
    } catch (e) {
      console.log(e)
      setError(e)
      setLoginSuccessful(false)
      setLoading(false)
    }
  }

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