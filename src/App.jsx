
import {Routes,Route, useNavigate} from 'react-router-dom'


import './App.css'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Home from './Pages/Home'
import Movie from './Pages/Movie'
import Reviews from './Pages/Reviews'
import User from './Pages/User'



import { auth } from "./firebase"
import { useEffect } from "react"

import { onAuthStateChanged } from "firebase/auth"
import Reviewer from './Pages/Reviewer'






function App() {



  let navigate=useNavigate()
 
  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if(user){
        
        console.log("user is  logged in")
      }
      else{
      
        console.log("Their is no user")
      }
    })
  })


  return (

    
      <div>
        <Routes>
         <Route path='/home' element={<Home/>}/>
         <Route path="/" element={<Login />} />
         <Route path="signup" element={<Signup/>}/>
         <Route path="/movie/:id" element={<Movie />} />

         <Route path="reviews" element={<Reviews/>} />
         <Route path="/reviewer/:userEmail" element={<Reviewer/>} />
         <Route path='user' element={<User/>}/>





       </Routes>
      </div>
      
  )
}

export default App
