import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'


export default function () {
    
    const navigate = useNavigate()
    const [formData , setFormData]  = useState({
        'alumnus' : false
    })

    const handleChange = (e) => {
        setFormData({
            ...formData , [e.target.id] : e.target.value
        })
    }

    const handleClick = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:5000/auth/create-user', {
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
          
          alert(`User registered successfully`)
          navigate('/signin')
          window.location.reload()


        } catch (error) {
          console.error(error)
          alert('Failed to create user. Please try again.')
        }
      }

  return (
    <div className='container bg-dark-subtle pb-5'>
        <div className="container mt-5 text-center text-dark pt-5">
            <h1>
                Sign Up
            </h1>
        </div>
        <div className="container mt-4">
            <form>
                <div className="row col-6 mx-auto mt-2">
                    <label htmlFor="email">Name</label>
                    <input type="text" id="name" className='form-control' onChange={handleChange}></input>
                </div>  
                <div className="row col-6 mx-auto mt-2">
                    <label htmlFor="email">Phone Number</label>
                    <input type="number" id="phoneNumber" className='form-control' onChange={handleChange}></input>
                </div>               
                <div className="row col-6 mx-auto mt-2">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" className='form-control' onChange={handleChange}></input>
                </div>
                <div className="row col-6 mx-auto mt-2">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" className='form-control' onChange={handleChange}></input>
                </div>
                <div className="row col-6 mx-auto mt-2">
                    <label htmlFor="alumnus" className="form-label">Are you an alumnus ?</label>
                    <select className="form-select" id="alumnus" aria-describedby="validationServer04Feedback" defaultValue={false} onChange={(e) => setFormData({
                        ...formData , [e.target.id] : e.target.value
                    })}>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                    </select>
                </div>
            </form>
        </div>
        <div className="container mt-4 mx-auto row col-2">
            <button type="button" className="btn btn-warning" onClick={handleClick}>Create account</button>
        </div>
        <div className="container mt-4 row mx-auto col-2">
            <span className='text-center fw-bold text-danger'> Already have an account ?</span>
            <button className='btn btn-outline-dark mt-2' onClick={() => navigate('/signin')}>Sign In</button>
        </div>
    </div>
  )
}
