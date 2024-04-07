import React, { useEffect , useState } from 'react'

export default function ViewResponses() {

  const [responses , setResponses] = useState([])
  const user_email = localStorage.getItem('user')


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

  console.log(responses)

  return (
    <div className='mt-5'>
      <div className='container text-center'>
        <h1 className='text-warning'>View responses for your requests</h1>
      </div>
      <div className='mt-5'>
        {responses.map((request) => (
          <div className='bg-secondary-subtle mt-4 p-3' key={request._id}> 
            <span className='ms-5'>Requested Blood Group : {request.BGType}</span>
            <span  className='ms-5'>User Requested : {request.userRequested.name}</span>
            <span className='ms-5'>Time requested : {request.timeRequested.substr(0,10)}</span>
            <button className='btn btn-outline-secondary ms-5' onClick={(e) => navigate(`/profile/${request.userRequested.email}`)}>View Patient Profile</button>
            <span className='ms-5'>Request Fulfilled : {request.fulfilled ? 'Yes' : 'No'}</span>
            {user_email !== request.userRequested.email && !request.fulfilled && <button className='ms-5 btn btn-outline-danger' onClick={(e) => handleDonatation(e , request._id)}>Donate Blood</button>}
            {request.fulfilled && <span className='ms-5'>Donated User : {request.userDonated.name}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}