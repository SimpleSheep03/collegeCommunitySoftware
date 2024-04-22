import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useNavigate } from 'react-router-dom';


export default function LoggedInHeader() {

  const navigate = useNavigate()

  const handleLogout = (e) => {
    localStorage.removeItem('user')
    window.location.reload()
  }

  const [search , setSearch] = useState('')

  const user_email = localStorage.getItem('user')

  const handleSearch = async (e) => {

    if(e.keyCode === 13){

      e.preventDefault()
      const query = search

      try {
          const response = await fetch('http://localhost:5000/search?query=' +  query)
          const data = await response.json()
          if(!response.ok){
            alert(`${data.message}`)
            return
          }
          navigate(`/search?query=${query}` , { state : data })
          
      } catch (error) {
          console.error(error)
          alert('Failed to fetch name profile')
          return
      }

    }

}

  return (
    <div className='sticky-top'>
         <nav className="navbar navbar-expand-lg bg-dark theme-dark" data-bs-theme="dark">
    <div className="container-fluid">
      <a className="navbar-brand" href='/'>
        <i className="bi bi-globe-central-south-asia p-4"></i>
        Connect IIITA
      </a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a className="nav-link" aria-current="page" href="/" id="home"  >Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" aria-current="page" href={`/profile/${user_email}`} id="home"  >My Profile</a>
          </li>
          <li className='nav-item'><a className="nav-link" href="/notifications"  id="notifications"  >Notifications</a></li><li><hr className="dropdown-divider"/></li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href='#' role='button' data-bs-toggle = 'dropdown' aria-expanded='false'>Job Board</a>
            <ul className='dropdown-menu'>
              <li><a className='dropdown-item' href='/viewJobPosts'id='myProfile'>View Job Posts</a></li>
              <li><a className='dropdown-item' href='/createJobPost'id='myProfile'>Create new job post</a></li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href='#' role='button' data-bs-toggle = 'dropdown' aria-expanded='false'>Lost & Found</a>
            <ul className='dropdown-menu'>
              <li><a className='dropdown-item' href='/viewItems'id='myProfile'>View reported items</a></li>
              <li><a className='dropdown-item' href='/reportItem'id='myProfile'>Report an item</a></li>
              <li><a className='dropdown-item' href='/yourItems'id='myProfile'>Your Items</a></li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href='#' role='button' data-bs-toggle = 'dropdown' aria-expanded='false'>Blood donation</a>
            <ul className='dropdown-menu'>
              <li><a className='dropdown-item' href='/trackBloodRequests'id='myProfile'>Track Blood Requests</a></li>
              <li><a className='dropdown-item' href='/requestBlood' id='myProfile'>Request Blood</a></li>
              <li><a className='dropdown-item' href='/viewResponses'id='myProfile'>Your requests</a></li>
            </ul>
          </li>
          <li className='nav-item'><a className="nav-link" href="/event-calender"  id="event-calender"  >Event Calender</a></li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href='#' role='button' data-bs-toggle = 'dropdown' aria-expanded='false'>Resource Hub</a>
            <ul className='dropdown-menu'>
              <li><a className='dropdown-item' href='/collegeResources'id='myProfile'>College related</a></li>
              <li><a className='dropdown-item' href='/JIResources'id='myProfile'>Job/Internship related</a></li>
            </ul>
          </li>
          <li className='nav-item'><a className="nav-link" href="/alumni-stories"  id="alumni-stories"  >Alumni Stories</a></li>
          <li className="nav-item">
            <a className="nav-link" aria-current="page" href="/messaging" id="messaging"    >Messaging</a>
          </li>
          <li className="nav-item">
            <a className="nav-link cursor-pointer" aria-current="page" onClick={handleLogout}   id='logout' href ='/signin'>Logout</a>
          </li>
          <form role="search">
            <input className="form-control mx-3" type="search" id='searchInput' placeholder="Search" aria-label="Search" style={{width : '100px' , height : '40px'}} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearch}/>
          </form>
        </ul>
      </div>
    </div>
  </nav>
    </div>
  )
}
