import React from "react";
import { BrowserRouter , Routes , Route } from "react-router-dom";
import LoggedInHeader from "./components/LoggedInHeader.jsx"
import LoggedOutHeader from "./components/LoggedOutHeader.jsx"
import Home from "./pages/Home.jsx"
import SignIn from "./pages/SignIn.jsx"
import SignUp from "./pages/SignUp.jsx"
import Profile from "./pages/Profile.jsx"
import Search from "./pages/Search.jsx";
import RequestBlood from "./pages/RequestBlood.jsx";
import TrackBloodRequests from "./pages/TrackBloodRequests.jsx";
import ViewResponses from "./pages/ViewResponses.jsx";
import Notification from "./pages/Notification.jsx";
import CreateJobPost from "./pages/CreateJobPost.jsx";
import ViewJobPosts from "./pages/ViewJobPosts.jsx";
import ReportItem from "./pages/ReportItem.jsx";
import ViewItems from "./pages/ViewItems.jsx";
import YourItems from "./pages/YourItems.jsx";
import CollegeResources from "./pages/CollegeResources.jsx";

function App() { 
  return (
    <BrowserRouter>
      {localStorage.getItem('user') ? <LoggedInHeader/> : <LoggedOutHeader/>}
      <Routes>
      <Route path="/" element = {<Home/>}></Route>
      <Route path="/signin" element = {<SignIn/>} />
      <Route path="/signup" element = {<SignUp/>} />
      <Route path="/profile/:username" element = {<Profile/>} />
      <Route path="/search" element = {<Search/>} />
      <Route path="/requestBlood" element = {<RequestBlood/>} />
      <Route path="/trackBloodRequests" element ={<TrackBloodRequests/>} />
      <Route path="/viewResponses" element={<ViewResponses/>}></Route>
      <Route path="/notifications" element={<Notification/>}/>
      <Route path="/createJobPost" element={<CreateJobPost/>}/>
      <Route path="/viewJobPosts" element={<ViewJobPosts/>}></Route>
      <Route path="/reportItem" element = {<ReportItem/>}></Route>
      <Route path="/viewItems" element = {<ViewItems/>}></Route>
      <Route path="/yourItems" element = {<YourItems/>}></Route>
      <Route path="/collegeResources" element = {<CollegeResources/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;