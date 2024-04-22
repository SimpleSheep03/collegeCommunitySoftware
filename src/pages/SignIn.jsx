import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function SignIn() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({})

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if(!response.ok){
        const data = await response.json()
        alert(`${data.message}`)
        return
      }

      const data = await response.json()
      
      localStorage.setItem('user' , `${data.user.email}`)
      
      alert(`User logged in successfully`)
      navigate('/')
      window.location.reload()


    } catch (error) {
      console.error(error)
      alert('Failed to signin user. Please try again.')
    }
  };

  return (
    <div className='container bg-dark-subtle pb-5'>
      <div className="container mt-5 text-center text-dark pt-5">
        <h1>
          Sign In
        </h1>
      </div>
      <div className="container mt-4">
        <form>
          <div className="row col-6 mx-auto mt-2">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })} className='form-control'></input>
          </div>
          <div className="row col-6 mx-auto mt-2">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })} className='form-control'></input>
          </div>
          <div className="container mt-4 mx-auto row col-1">
            <button type="submit" className="btn btn-warning" onClick={handleLogin}>Log In</button>
          </div>
        </form>
      </div>
      <div className="container mt-4 row mx-auto col-2">
        <span className='text-center fw-bold text-danger'> Don't have an account ?</span>
        <button className='btn btn-outline-dark mt-2' onClick={() => navigate('/signup')}>Sign Up</button>
      </div>
    </div>
  )
}