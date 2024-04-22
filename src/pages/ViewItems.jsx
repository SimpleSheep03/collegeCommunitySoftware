import React, { useEffect, useState } from 'react'

export default function ViewItems() {

  const [items, setItems] = useState([])

  useEffect(() => {

    const fetchItems = async () => {

      try{

        const response = await fetch(`http://localhost:5000/viewItems?user=all`)
        const data = await response.json()
        if(!response.ok){
          alert(`${data.message}`)
        }
        setItems(data.items)

      }
      catch(error){
        console.log(error)
        alert('Could not fetch items')
      }

    }

    fetchItems()

  }, [])

  

  return (
    <div className='container bg-dark-subtle mt-5 py-5 border border-warning'>
      <div className='text-center text-warning-emphasis'>
        <h1>View Lost & Found Items</h1>
      </div>
      <div className='p-5 row'>
        {items.map((item) => (
          <div key={item._id} className='card border-warning mt-5 p-4 col-5 mx-auto'>
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">Description : <span className='fw-bold'>{item.description}</span></p>
                  <p className='cart-text'>Resolved ? <span className='fw-bold'>{item.status ? 'Yes' : 'No'}</span></p>
                  <p className="card-text"><small className="text-body-secondary">Added on {item.time.substr(0,10)} by <a className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href={`http://localhost:3000/profile/${item.userReporting.email}`}>{item.userReporting.name}</a></small></p>
                </div>
                <img src={item.photoURL} className="card-img-bottom" alt="..."/>
          </div>
        ))}
      </div>

    </div>
  )
}
