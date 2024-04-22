import React, { useState , useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TrackBloodRequests() {

  const [bloodRequests , setBloodRequests] = useState([])
  const [user, setUser] = useState([])
  const navigate = useNavigate()
  const user_email = localStorage.getItem('user')

  useEffect(() => {
    const fetchAllRequests = async () => {
      try{
        const resposne = await fetch('http://localhost:5000/findBloodRequests')
        const data = await resposne.json()
        if(!resposne.ok){
          alert(`${data.message}`)
        }
        setBloodRequests(data.bloodRequests)
      }
      catch(error){
        console.log(error)
        alert('Could not fetch requests')
      }
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/profile?user=' +  user_email)
        const data = await response.json()
        if(!response.ok){
          alert(`${data.message}`)
        }
        setUser(data.user)
      } catch (error) {
        console.error(error)
        alert('Failed to fetch user profile')
      }
    };

    fetchData()

    fetchAllRequests()

  },[])

  const handleDonatation = async (e , id , index) => {

    e.preventDefault()

    try{
      const response = await fetch('http://localhost:5000/updateBloodRequest' , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id , user })
      })

      const data = await response.json()
      if(!response.ok){
        alert(`${data.message}`)
      }

      alert(`${data.message}`)

    }
    catch(error){
      console.log(error)
      alert('Could not donate')
    }

    const query = bloodRequests[index].userRequested.name
    console.log(query)
    let patient;

    try {
      const response = await fetch('http://localhost:5000/search?query=' +  query)
      const data = await response.json()
      if(!response.ok){
        alert(`${data.message}`)
        return
      }
      patient = data.users[0]
      
    }
    catch(error){
      alert('Could not fetch the details of the patient')
    }

    const message = `${user.name} is willing to donate blood to you`
    const link = 'http://localhost:3000/viewResponses'

    try{

      const response = await fetch('http://localhost:5000/sendNotification',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message , users : [patient] , user , link })
      })
      const data = await response.json()
      if(!response.ok){
        alert(`${data.message}`)
      }
      console.log(data.message)
      window.location.reload()
    }
    catch(error){
      alert('Could not notify receiver')
    }

  }

  const bloodGroupCompatibilities = new Map([
    ['A+', [ 'A+', 'A-', 'O+', 'O-' ]],
    ['A-', [ 'A-', 'O-' ]],
    ['B+', [ 'B+', 'B-', 'O+', 'O-' ]],
    ['B-', [ 'B-', 'O-' ]],
    ['AB+', [ 'A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-' ]],
    ['AB-', [ 'A-', 'B-', 'O-' ]],
    ['O+', [ 'O+', 'O-' ]],
    ['O-', [ 'O-' ]],
  ]); 


  return (
    <div className='mt-5'>
      <div className='container text-center'>
        <h1 className='text-warning-emphasis'>All Blood Requests</h1>
      </div>
      <div className='mt-5'>
        {bloodRequests.map((request , index) => (
          <div className='bg-secondary-subtle mt-4 p-3 d-flex justify-content-evenly border border-warning' key={request._id}> 
            <span className=''>Requested Blood Group : <span className='fw-bold'>{request.BGType}</span></span>
            <span  className=''>User Requested : <a href={`/profile/${request.userRequested.email}`} className="link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">{request.userRequested.name.split(' ')[0]}</a></span>
            <span className=''>Time requested : <span className='fw-bold'>{request.timeRequested.substr(0,10)}</span></span>
            <span className=''>Request Fulfilled : <span className='fw-bold'>{request.fulfilled ? 'Yes' : 'No'}</span></span>
            {user_email !== request.userRequested.email && !request.fulfilled && <button className='ms-5 btn btn-outline-danger' onClick={(e) => handleDonatation(e , request._id , index)}>Donate Blood</button>}
            {request.fulfilled && <span className=''>Donated User : <a href="#" className="link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">{request.userDonated.name}</a></span>}
            <div className='text-center mt-2'>
              <div className="btn-group">
                <button type="button" className="btn btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                  View compatible donar types
                </button>
                <ul className="dropdown-menu">
                  {bloodGroupCompatibilities.get(`${request.BGType}`).map((donar, index) => (
                    <li key={index}><a className="dropdown-item" href="#">{donar}</a></li>
                  ))
                  }
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
