import React, { useEffect, useState } from 'react'

export default function ReportItem() {

    const [formData , setFormData] = useState({})
    const [user , setUser]  = useState({})
    const [users , setUsers] = useState([])
    const user_email = localStorage.getItem('user')

    useEffect(() => {

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
          }

          const fetchUsers = async(req,res) => {
        
            const query =''
            
            try {
              const response = await fetch('http://localhost:5000/search?query=' +  query)
              const data = await response.json()
              if(!response.ok){
                alert(`${data.message}`)
                return
              }
              setUsers(data.users)
              
            } catch (error) {
              console.error(error)
              alert('Failed to fetch name profile')
              return
            }
            
          }

        fetchUsers()

        fetchData()

    },[])


    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.id] : e.target.value
        })
    }

    
    
    const handleSubmit = async (e) => {

        e.preventDefault()
        const name = formData.name
        const description = formData.description
        const photoURL = (formData.photoURL ? formData.photoURL : 'NA')

        try{

            const response = await fetch('http://localhost:5000/reportItem ', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({name , description , photoURL , user})
              });
            

            const data = await response.json()

            if(!response.ok){
                alert(`${data.message}`)
            }
            alert(`${data.message}`)

        }
        catch(error){
            console.log(error)
            alert('Could not report the item')
        }

        try{

            const usersExceptMe = users
            for(let i = 0; i < usersExceptMe.length ; i ++ ){
              if(usersExceptMe[i].email === user.email){
                usersExceptMe.splice(i , 1)
              }
            }
    
            const message = `${name} was lost/found`
            const link = 'http://localhost:3000/viewItems'
    
            const response = await fetch('http://localhost:5000/sendNotification',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({message , users : usersExceptMe , user , link}),
            })
            const data = await response.json()
            if(!response.ok){
              alert(`${data.message}`)
            }
            console.log(data.message)
            window.location.reload()
          }
          catch(error){
            console.log(error)
            alert('Could not notify other users')
          }

    }

    const handleImageChange = (event) => {
        
        const imageFile = event.target.files[0];
        const reader = new FileReader();
      
        reader.onloadend = () => {
          // Process the image data (e.g., display preview)
          const imageURL = reader.result
            setFormData({
                ...formData , [event.target.id] : imageURL
            })
    
        }
      
        reader.readAsDataURL(imageFile);
      }

  return (
    <div className='container bg-dark-subtle mt-5 py-5 border border-warning'>
        <div className='text-center text-warning-emphasis'>
            <h1>
                Report an Item
            </h1>
        </div>
            <div className='col-9 mx-auto'>
            <form>
                <div className="mb-3 mt-5">
                    <label htmlFor="name" className="form-label">Item name</label>
                    <input type="text" className="form-control" id="name" onChange={(e) => handleChange(e)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" onChange={(e) => handleChange(e)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="photoURL" className="form-label">Photo</label>
                    <input type="file" className="form-control" id="photoURL" onChange={(e) => handleImageChange(e)}/>
                </div>
                <div className='d-flex justify-content-center mt-4'>
                    <button className="btn btn-outline-dark col-3" onClick={(e) => handleSubmit(e)}>Report Item</button>
                </div>
            </form>
        </div>
    </div>
  )
}
