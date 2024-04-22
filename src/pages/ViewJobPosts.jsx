import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ViewJobPosts() {

    const [jobPosts , setJobPosts] = useState([])
    const navigate = useNavigate()

    useEffect( ()=>{ 

        const fetchPosts = async () => {

            const response = await fetch('http://localhost:5000/viewJobPosts')

            const data = await response.json()
            if(!response.ok){
                alert(`${data.message}`)
            }
            setJobPosts(data.jobPosts)

        }

        fetchPosts()

    }, [] )

  return (
    <div className='container bg-dark-subtle mt-5 py-5 border border-warning'>
        <span className='text-center text-warning-emphasis'>
            <h1>View Job Posts</h1>
        </span>
        <div className='mt-5 col-6 mx-auto'>
            {jobPosts.map((jobPost) => (
                <div className="card border-warning mt-3 p-4" key={jobPost._id}>
                <div className="card-body">
                  <h5 className="card-title">{jobPost.companyName}</h5>
                  <p className="card-text">Designation : <span className='fw-bold'>{jobPost.designation}</span></p>
                  <p className='cart-text'>Salary : <span className='fw-bold'>{jobPost.salary}</span></p>
                  <p className='card-text'>Location : <span className='fw-bold'>{jobPost.location}</span></p>
                  <p className='card-text'>Requirements : <span className='fw-bold'>{jobPost.requirements}</span></p>
                  <p className='card-text'>Description : <span className='fw-bold'>{jobPost.description}</span></p>
                  <p className="card-text"><small className="text-body-secondary">Added on {jobPost.time.substr(0,10)} by <a className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href={`http://localhost:3000/profile/${jobPost.userWhoPosted.email}`}>{jobPost.userWhoPosted.name}</a></small></p>
                  <a href={jobPost.link}>
                    <button className='btn btn-outline-danger'>Apply Now</button>
                  </a>
                </div>
                <img src={jobPost.photoURL} className="card-img-bottom" alt="..."/>
              </div>
            ))}
        </div>

    </div>
  )
}
