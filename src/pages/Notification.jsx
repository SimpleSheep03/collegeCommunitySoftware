import React, { useEffect, useState } from 'react'

export default function Notification() {

    const user_email = localStorage.getItem('user')
    const [notifications , setNotifications] = useState([])
    const [user, setUser] = useState({})

    useEffect(() => {

        const fetchNotifications = async() => {

            try{

                const response = await fetch('http://localhost:5000/viewNotifications', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_email }),
                })
                const data = await response.json()
                if(!response.ok){
                    alert(`${data.message}`)
                }

                setNotifications(data.notifications)

            }
            catch(error){
                console.log(error)
                alert('Could not fetch notifications')
            }

        }

        fetchNotifications()

    },[])


  return (
    <div className='container mt-5 py-5'>
        <div className='text-center text-warning-emphasis'>
            <h1>Notifications</h1>
        </div>
        <div className='mt-5'>
        {notifications.map((notification, index) => (
            <div className='mt-3 d-flex p-3 bg-dark-subtle justify-content-evenly border border-warning' key={index}>
                <p className='fw-bold'>{notification.message}</p>
                <span>Time : {notification.time.substr(0,10)}</span>
                <a href={notification.link}>
                    <button className='btn btn-outline-dark'>View</button>
                </a>
            </div>
        ))}
        </div>
    </div>
  )
}
