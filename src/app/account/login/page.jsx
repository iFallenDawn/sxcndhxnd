'use client'
import { useUserContext } from '@/context/UserContext'
import { useState } from 'react'
import validation from '@/data/validation'

const Login = () => {
  const { user, setUser } = useUserContext()

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
      const reqBody = {
        email: email,
        password: password
      }
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify(reqBody),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (!response.ok) throw data.error
      setUser(data)
      console.log(data)
      setLoginSuccessful(true)
    } catch (e) {
      console.log(e)
      setError(e)
      setLoginSuccessful(false)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col'>
      {loginSuccessful && (
        <h1>Successfully logged in!</h1>
      )}
      {!loginSuccessful && loginSuccessful !== '' && (
        <h1>{error}</h1>
      )}
      <h1>Login</h1>
      <label>
        Email:
        <input type="text" name="email" onChange={handleEmail} />
      </label>
      <label>
        Password:
        <input type="Password" name="password" onChange={handlePassword} />
      </label>
      <button type="submit">Submit</button>
    </form>
  )
}

export default Login