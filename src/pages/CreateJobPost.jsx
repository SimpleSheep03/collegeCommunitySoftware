import React, { useState , useEffect } from 'react'

export default function CreateJobPost() {

    const [formData , setFormData] = useState({
        'photoURL' : 'NA',
        'Description' : 'Not Available',
        'link' : '#'
    })
    const [user , setUser] = useState({})
    const user_email = localStorage.getItem('user')
    const [users , setUsers] = useState([])


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
        };

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

      }, [])

      const handleChange = (e) => {
          setFormData({
              ...formData , [e.target.id] : e.target.value
          })
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


      const handleSubmit = async(e) => {

        e.preventDefault()  
        
        // companyName , designation , salary , location , description , photoURL , requirements , user , link

        const companyName = formData.companyName
        const designation = formData.designation
        const salary = formData.salary
        const location = formData.location
        const description = formData.description
        const photoURL = formData.photoURL
        const requirements = formData.requirements
        const link = formData.link
        const approvedByAdmin = ( user.alumnus ? true : false )
          

        try{

            const response = await fetch('http://localhost:5000/createJobPost', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({companyName , designation , salary , location , description , photoURL , requirements , user , link , approvedByAdmin})
              });
            

            const data = await response.json()

            if(!response.ok){
                alert(`${data.message}`)
            }
            alert(`${data.message}`)

        }
        catch(error){
            console.log(error)
            alert('Could not create job post')
        }

        if(approvedByAdmin)
        {try{

            const usersExceptMe = users
            for(let i = 0; i < usersExceptMe.length ; i ++ ){
              if(usersExceptMe[i].email === user.email){
                usersExceptMe.splice(i , 1)
              }
            }
    
            const message = `${companyName} is hiring`
            const link = 'http://localhost:3000/viewJobPosts'
    
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

      }

      

  return (
    <div className='container bg-dark-subtle mt-5 py-5 border border-warning'>
        <div className='text-center text-warning-emphasis'>
            <h1>Create a Job Post</h1>
        </div>
        <div>
        <div className='col-9 mx-auto'>
            <form>
                <div className="mb-3 mt-5">
                    <label htmlFor="companyName" className="form-label">Company Name</label>
                    <input type="text" className="form-control" id="companyName" onChange={(e) => handleChange(e)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="designation" className="form-label">Designation</label>
                    <input type="text" className="form-control" id="designation" onChange={(e) => handleChange(e)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="salary" className="form-label">Salary</label>
                    <input type="text" className="form-control" id="salary" onChange={(e) => handleChange(e)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input type="text" className="form-control" id="location" onChange={(e) => handleChange(e)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="requirements" className="form-label">Requirements</label>
                    <input type="text" className="form-control" id="requirements" onChange={(e) => handleChange(e)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="link" className="form-label">Link</label>
                    <input type="text" className="form-control" id="link" onChange={(e) => handleChange(e)}/>
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
                    <button className="btn btn-outline-dark col-3" onClick={(e) => handleSubmit(e)}>Create Job Post</button>
                </div>
            </form>
        </div>
        </div>
    </div>
  )
}
