import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import { defaultImage , defaultJobImage , defaultItemImage } from "./defaultImage.js"

mongoose.connect('mongodb://localhost:27017/').then(() => console.log('Connected to database')).catch((error) => console.log(error))

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1024,
  },
  photoURL : {
    type : String,
    default : `${defaultImage}`
  },
  about : {
    type : String,
  },
  passoutYear : {
    type : Number,
  },
  phoneNumber : {
    type : Number,
    required : true,
    unique : true,
    min: -9007199254740991, // minimum value for int64
    max: 9007199254740991
  },
  alumnus : {
    type : Boolean,
    required : true
  },
  approvedByAdmin : {
    type : Boolean,
    default : false
  }
})

const User = mongoose.model('User', UserSchema)

const QuerySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  queryMessage: {
    type: String,
    required: true,
  }
})

const Query = mongoose.model('Query' , QuerySchema)

const BloodRequestSchema = new mongoose.Schema({
  BGType : {
    type : String ,
    required : true
  },
  userRequested : {
    type : Object,
    required : true
  },
  timeRequested : {
    type : Date,
    default : Date.now()
  },
  fulfilled : {
    type : Boolean,
    default : false,
  },
  userDonated : {
    type : Object
  }
})

const BloodRequest = mongoose.model('Blood Request' , BloodRequestSchema)

const NotificationSchema = new mongoose.Schema({
  message : {
    type : String,
    required : true
  },
  link : {
    type : String,
  },
  usersToBeNotified : {
    type : Array,
    default : []
  },
  userWhoSent : {
    type : Object,
    required : true,
  },
  time : {
    type : Date,
    required : true
  }
})

const Notification = mongoose.model('Notification' , NotificationSchema)

const JobPostSchema = new mongoose.Schema({
  companyName : {
    type : String,
    required : true
  },
  designation : {
    type : String,
    required : true
  },
  salary : {
    type : String,
    required : true
  },
  photoURL : {
    type : String,
    default : `${defaultJobImage}`
  },
  location : {
    type : String,
    required : true
  },
  description : {
    type : String
  },
  requirements : {
    type : String,
    required : true
  },
  userWhoPosted : {
    type : Object,
    required : true
  },
  link : {
    type : String,
    required : true
  },
  time : {
    type : Date,
    required : true
  },
  approvedByAdmin : {
    type : Boolean,
    required : true
  }
})

const JobPost = mongoose.model('JobPost' , JobPostSchema)

const ItemSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  time : {
    type : Date, 
    required : true
  },
  photoURL : {
    type : String,
  },
  userReporting : {
    type : Object,
    required : true
  },
  description : {
    type : String,
    required : true
  },
  status : {
    type : Boolean,
    default : false
  }
  
})

const Item = mongoose.model('Item' , ItemSchema)

const MessageSchema = new mongoose.Schema({
  users : {
    type : Array,
    required : true
  },
  content : {
    type : Array ,
    default : []
  }
})

const Message = mongoose.model('Message' , MessageSchema)

const app=express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.listen(5000,function(){
  console.log("Listening on port 5000");
})

app.post("/" , (req,res) => {
    res.send({
        name : req.body.name,
    })
})

app.post("/auth/create-user" , async (req,res) => {

    // Validate request body
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).send({
        message : "All the fields are required",
      });
    }
    
  
    // Create a new user
    const user = new User({
      name: req.body.name,
      phoneNumber : req.body.phoneNumber,
      email: req.body.email,
      password: req.body.password,
      alumnus : req.body.alumnus
    });
  
    try {
      // Save the user to the database
      const result = await user.save();
      
      return res.status(201).send({
        message: "Details submitted successfully, to be verified by the admin...",
        user: result,
      });
    } catch (error) {
      // Handle errors
      console.log(error)
      if (error.code === 11000) {
        // Duplicate email error
        return res.status(400).send({
          message : "Email already exists",
        });
      }
      return res.status(500).send({
        message : "Failed to create user",
      });
    }
})

app.post("/auth/signin" , async (req, res) => {

  const { email, password } = req.body

  if ( !email || !password) {
    return res.status(400).send({
      error: "Email, and password are required fields"
    })
  }

  try{

    const user = await User.findOne({ email})

    if(!user || user.password != password){
      return res.status(404).send({
        message : 'Invalid credentials'
      })
    }

    if(!user.approvedByAdmin){
      return res.status(401).send({
        message : 'Login denied till details are verified..'
      })
    }

    return res.status(200).send({
      message : 'User logged in successfully',
      user : user
    })
  }
  catch(error) {
    return res.status(500).send({
      message : 'Failed to sign in'
    })
  }

})



app.post("/contact-us" , async (req,res) => {

  const { email , query : queryMessage } = req.body

  if(!email || !queryMessage){
    return res.status(400).send({
      message : 'Fill all the fields'
    })
  }

  const query = new Query({
    email : email,
    queryMessage : queryMessage
  })

  try{
    const data = await query.save()
    return res.status(201).send({
      message : 'Query raised successfullly... We will email you back soon'
    })
  }
  catch(error) {
    console.log(error)
    return res.status(500).send({
      message : 'Internal server error... Could not raise query'
    })
  }

})

app.get("/profile" , async (req,res) => {

  const { user } = req.query

  if(!user){
    return res.status(400).send({
      message : 'Fill all fields'
    })
  }

  
  try{

    const user_from_database = await User.findOne({ email : user})

    // console.log(user_from_database)
  
    if(!user_from_database){
      return res.status(401).send({
        message : 'This is not a registered user'
      })
    }

    res.status(201).send({
      message : 'User found',
      user : user_from_database
    })
    
  }
  catch(error){
    return res.status(500).send({
      message : 'Internal server occurred while fetching user profile'
    })
  }
})

app.put("/user/updateAbout" , async (req, res) => {
  const { email , profileAboutData } = req.body

  if(!email || !profileAboutData){
    return res.status(400).send({
      message : 'All fields are necessary'
    })
  }

  const user = await User.findOne( { email })

  if(!user){
    return res.status(401).send({
      message : 'No such user found'
    })
  }

  try{
    await User.findOneAndUpdate(
      {email : email},
      {about : profileAboutData},
      {new : true}
    )

    return res.status(201).send({
      message : 'About has been updated',
      profileAboutData
    })

  }
  catch(error){
    return res.status(500).send({
      message : 'Internal server error'
    })
  }

})

app.put("/user/updateYear" , async (req, res) => {
  const { email , passoutYear} = req.body

  if(!email || !passoutYear){
    return res.status(400).send({
      message : 'All fields are necessary'
    })
  }

  const user = await User.findOne( { email })

  if(!user){
    return res.status(401).send({
      message : 'No such user found'
    })
  }

  try{
    await User.findOneAndUpdate(
      {email : email},
      {passoutYear : passoutYear},
      {new : true}
    )

    return res.status(201).send({
      message : 'Passout year has been updated',
      passoutYear
    })

  }
  catch(error){
    return res.status(500).send({
      message : 'Internal server error'
    })
  }

})

app.put("/user/updatePhone" , async (req, res) => {
  const { email , phoneNumber} = req.body

  if(!email || !phoneNumber){
    return res.status(400).send({
      message : 'All fields are necessary'
    })
  }

  const user = await User.findOne( { email })

  if(!user){
    return res.status(401).send({
      message : 'No such user found'
    })
  }

  try{
    await User.findOneAndUpdate(
      {email : email},
      {phoneNumber : phoneNumber},
      {new : true}
    )

    return res.status(201).send({
      message : 'Phone Number has been updated',
      phoneNumber
    })

  }
  catch(error){
    return res.status(500).send({
      message : 'Internal server error'
    })
  }

})

app.put("/user/updateAlumnus" , async (req, res) => {
  const { email , alumnus} = req.body

  if(!email || !alumnus){
    return res.status(400).send({
      message : 'All fields are necessary'
    })
  }

  const user = await User.findOne( { email })

  if(!user){
    return res.status(401).send({
      message : 'No such user found'
    })
  }

  try{
    await User.findOneAndUpdate(
      {email : email},
      {alumnus : alumnus},
      {new : true}
    )

    return res.status(201).send({
      message : 'Alumnus status has been updated',
      alumnus
    })

  }
  catch(error){
    console.log(error)
    return res.status(500).send({
      message : 'Internal server error'
    })
  }

})

app.put("/user/updateImage" , async (req, res) => {
  const { email , imageURL} = req.body

  if(!email || !imageURL){
    return res.status(400).send({
      message : 'All fields are necessary'
    })
  }

  const user = await User.findOne( { email })

  if(!user){
    return res.status(401).send({
      message : 'No such user found'
    })
  }

  try{
    await User.findOneAndUpdate(
      {email : email},
      {photoURL : imageURL},
      {new : true}
    )

    return res.status(201).send({
      message : 'Photo has been updated',
      imageURL
    })

  }
  catch(error){
    return res.status(500).send({
      message : 'Internal server error'
    })
  }

})

app.get("/search" , async (req , res) => {

  const { query }  = req.query

  try{
    // Use a regular expression to perform a case-insensitive search for the name substring
    const users = await (User.find({ name: { $regex: query, $options: 'i' } })).find({ approvedByAdmin : true })

    res.status(201).send({
      message : `Search Request fulfilled` , 
      users
    })

  }
  catch(error){
    console.log(error)
    res.status(500).send({
      message : 'Internal server error'
    })
  }

})

app.post("/requestBlood" , async(req,res) => {
  const { BGType , user } = req.body
  try{
    
    const bgRequest = new BloodRequest({
      BGType : BGType,
      userRequested : user
    })

    const BGRequest = await bgRequest.save()

    res.status(201).send({
      message : 'A request has been put',
      BGRequest
    })

  }
  catch(error){
    console.log(error)
    res.status(500).send({
      message : 'Internal Server Error'
    })
  }
})

app.get("/findBloodRequests" , async(req, res) => {

  try{

    const bloodRequests = await BloodRequest.find({}).sort({ fulfilled : 1 }).sort({ timeRequested : -1 })

    res.status(201).send({
      message : 'Found blood requests',
      bloodRequests
    })

  }
  catch(error){
    console.log(error)
    res.status(500).send({
      message : 'Internal Server Error'
    })
  }
})

app.put("/updateBloodRequest" , async(req, res) => {

  const { id , user } = req.body

  try{
    await BloodRequest.findOneAndUpdate(
      {_id : id},
      {fulfilled : true},
      {new : true}
    )
    await BloodRequest.findOneAndUpdate(
      {_id : id},
      {userDonated : user},
      {new : true}
    )

    res.status(201).send({
      message : 'Donate request processed... The receiver will be notified'
    })

  }
  catch(error){
    console.log(error)
    res.status(500).send({
      message : 'Internal server error'
    })
  }

})

app.post("/veiwUserBloodRequests" , async (req, res) => {

  const { user_email } = req.body

  try{

    const responses = await BloodRequest.find({ 'userRequested.email' : user_email })

    res.status(201).send({
      message : 'Found your responses' , 
      responses
    })

  }
  catch(error){
    console.log(error)
    res.status(500).send({
      message : 'Internal Server Error'
    })
  }

})

app.post("/sendNotification" , async(req,res) => {
  const { message , users , user , link } = req.body

  try{

    const notification = new Notification({
      message : message,
      userWhoSent : user,
      usersToBeNotified : users,
      link : link,
      time : Date.now()
    })

    const response = await notification.save()

    res.status(201).send({
      message : 'Notification sent',
      response
    })

  }
  catch(error){
    console.log(error)
    res.status(500).send({
      message : 'Internal Server Error'
    })
  }

})



app.post("/viewNotifications" , async(req,res) => {

  const { user_email } = req.body

  try{

    let allNotifications = await Notification.find({}).sort({ time : -1 })
    let notifications = []
    allNotifications.map((notification) => {
      notification.usersToBeNotified.map((user) => {
        if(user.email == user_email){
          notifications.push(notification)
        }
      })
    })

    res.status(201).send({
      message : 'Notifications received successfully',
      notifications
    })

  }
  catch(error){
    console.log(error)
    res.status(500).send({
      message : 'Internal Server Error'
    })
  }

})

app.post("/createJobPost" , async (req, res) => {
  const { companyName , designation , salary , location , description , photoURL , requirements , user , link , approvedByAdmin } = req.body

  try{

    const jobPost = new JobPost({
      companyName : companyName,
      designation : designation,
      salary : salary,
      location : location,
      description : description,
      photoURL : (photoURL === 'NA' ? defaultJobImage : photoURL),
      requirements : requirements,
      userWhoPosted : user,
      link : link,
      time : Date.now(),
      approvedByAdmin
    })

    const response = await jobPost.save()

    res.status(201).send({
      message : 'Job Post created succesfully',
      response
    })

  }
  catch(error){
    console.log(error)
    res.status(500).send({
      message : 'Internal Server Error'
    })
  }

})

app.get("/viewJobPosts" , async(req,res) => {

  try{

    const jobPosts = await JobPost.find({ approvedByAdmin : true }).sort({ time : -1})

    res.status(201).send({
      message : 'Job Posts fetched successfully',
      jobPosts
    })

  }
  catch(error){
    console.log(error)
    res.status(500).end({
      message : 'Internal Server Error'
    })
  }

})

app.post("/reportItem" , async(req,res) => {

  const { name , description , photoURL , user } = req.body
  
    try{

      const item = new Item({
        name ,
        time : Date.now(),
        userReporting : user,
        photoURL : (photoURL === 'NA' ? defaultItemImage : photoURL),
        description
      })

      const response = await item.save()

      res.status(201).send({
        message : 'Item reported successfully',
        response
      })

    }
    catch(error){
      console.log(error)
      res.status(500).send({
        message : 'Internal server error'
      })
    }

})

app.get("/viewItems" , async (req,res) =>{

  const { user } = req.query

  let items

  try{
    if(user != 'all')
    items = await Item.find({ 'userReporting.email' : user }).sort({ time : -1 })
    else
    items = await Item.find({}).sort({ time : -1 })

    res.status(201).send({
      message : 'Fetched items successfully',
      items
    })

  }
  catch(error){
    console.log(error)
    res.status(500).send({
      message : 'Internal Server Error'
    })
  }

})

app.put("/updateResolvedStatus" , async(req, res) => {

  const { id , status } = req.body

  try{

    await Item.findOneAndUpdate({
      _id: id,  // Update based on a unique field
    }, {
      status: !status
    })    

    res.status(201).send({
      message : 'Resolved status changed successfully'
    })

  }
  catch(error){
    console.log(error)
    res.status(500).send({
      message : 'Internal Server Error'
    })
  }

})

app.post('/collegeResources' , async(req,res) => {
  app.use(bodyParser.urlencoded({ extended: true })); 
  console.log(req.body)
})

app.post('/findExistingUsers' , async(req, res) => {

  const { user_email , search } = req.body

  try{

    const all_users = await User.find({})
    const all_chats = await Message.find({})
    const users_from_search = await User.find({ name: { $regex: search, $options: 'i' } })

    // console.log(users_from_search.length)

    let users = []

    all_users.map((user) => {
      if(user.email != user_email) {
        let flag = 0
        all_chats.map((chat) => {
          if((chat.users[0].email == user_email || chat.users[1].email == user_email) && (chat.users[0].email == user.email || chat.users[1].email == user.email))[
            flag = 1
          ]
        })

        if(flag) {
          flag = 0
          users_from_search.map((y) => {
            if(y.email == user.email){
              flag = 1
            }
          })
          if(flag){
            users.push(user)
          }
        }
      }
    })

    // console.log(users.length)

    res.status(201).send({
      message : 'Retrieved users',
      users
    })
  }
  catch(error){
    console.log(error)
    res.status(500).send({
      message : 'Internal Server Error'
    })
  }
})

app.post('/findNewUsers' , async(req, res) => {

  const { user_email , search } = req.body

  try{

    const all_users = await User.find({})
    const all_chats = await Message.find({})
    const users_from_search = await User.find({ name: { $regex: search, $options: 'i' } }).find({ approvedByAdmin : true})

    // console.log(users_from_search.length)

    let users = users_from_search
    for(let i = 0 ; i < users.length ; i ++){
      if(users[i].email == user_email){
        users.splice(i , 1)
      }
    }

    // all_users.map((user) => {
    //   if(user.email != user_email) {
    //     let flag = 1
    //     all_chats.map((chat) => {
    //       if((chat.users[0].email == user_email || chat.users[1].email == user_email) && (chat.users[0].email == user.email || chat.users[1].email == user.email))[
    //         flag = 0
    //       ]
    //     })

    //     if(flag) {
    //       flag = 0
    //       users_from_search.map((y) => {
    //         if(y.email == user.email){
    //           flag = 1
    //         }
    //       })
    //       if(flag){
    //         users.push(user)
    //       }
    //     }
    //   }
    // })

    // console.log(users.length)

    res.status(201).send({
      message : 'Retrieved users',
      users
    })
  }
  catch(error){
    console.log(error)
    res.status(500).send({
      message : 'Internal Server Error'
    })
  }
})

app.post("/Chat" , async(req,res) => {

  const {user_email , friend} = req.body

  try{

    let chat_array = []
    let flag = 0
    let id

    const all_chats = await Message.find({})
    const user = await User.find({ email : user_email })
    let friend_user = await User.find({ email : friend })

    all_chats.map((chat) => {
      if((chat.users[0].email == user_email || chat.users[1].email == user_email) && (chat.users[0].email == friend || chat.users[1].email == friend)){
        flag = 1
        chat_array = chat.content
        id = chat._id
      }
    })

    friend_user = friend_user[0]

    if(!flag){

      const New_chat = new Message({
        users : [user[0] , friend_user],
        content : [],
        friend_user
      })

      const new_chat = await New_chat.save()
      const id = new_chat._id

      res.status(201).send({
        message : 'New chat created...',
        chat_array : [],
        friend_user,
        id
      })
    }

    else{
      res.status(201).send({
        message : 'Chat retrieved...',
        chat_array,
        friend_user,
        id
      })
    }

  }
  catch(error){
    console.log(error)
    res.status(500).send({
      message : 'Internal Server Error'
    })
  } 
})

app.post("/addMessage" , async (req, res) => {

  const {friend_user , user_email , message , id} = req.body

  try{

    const user = await User.findOne({ email : user_email })
    const msg = await Message.findOne({ _id : id })
    
    msg.content= [{
      sender : user,
      receiver : friend_user,
      body : message
    } , ...msg.content]

    await Message.findOneAndDelete({ _id : id })

    const new_msg = new Message({
      users : msg.users,
      content : msg.content,
    })

    const response = await new_msg.save()

    res.status(201).send({
      message : 'Message added...',
      response
    })

  }
  catch(error){
    console.log(error)
    res.status(500).send({
      message : 'Internal Server Error'
    })
  }

})