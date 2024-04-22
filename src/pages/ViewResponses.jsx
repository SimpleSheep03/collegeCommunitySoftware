import React, { useEffect , useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ViewResponses() {

  const [responses , setResponses] = useState([])
  const user_email = localStorage.getItem('user')
  const navigate = useNavigate()


  useEffect(() => {

    const fetchResponses = async () => {

      try{
        const response = await fetch('http://localhost:5000/veiwUserBloodRequests',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_email })
        })
          const data = await response.json()
          if(!response.ok){
            alert(`${data.message}`)
          }
          console.log(data)
          setResponses(data.responses)
      }
      catch(error){
        console.log(error)
        alert('Could not fetch responses')
      }

    } 

    fetchResponses()

  },[])

  return (
    <div className='mt-5'>
      <div className='container text-center'>
        <h1 className='text-warning-emphasis'>View responses for your requests</h1>
      </div>
      <div className='mt-5'>
        {responses.map((request) => (
          <div className='bg-secondary-subtle mt-4 p-3 d-flex justify-content-evenly border border-warning' key={request._id}> 
            <span className=''>Requested Blood Group : <span className='fw-bold'>{request.BGType}</span></span>
            <span  className=''>User Requested : <a href={`/profile/${request.userRequested.email}`} className="link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">{request.userRequested.name.split(' ')[0]}</a></span>
            <span className=''>Time requested : <span className='fw-bold'>{request.timeRequested.substr(0,10)}</span></span>
            <span className=''>Request Fulfilled : <span className='fw-bold'>{request.fulfilled ? 'Yes' : 'No'}</span></span>
            {request.fulfilled && <span className=''>Donated User : <a href="#" className="link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">{request.userDonated.name}</a></span>}
          </div>
        ))}
      </div>
    </div>
  )
}
