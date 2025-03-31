import React, { useState } from 'react'

import './CSS/login.css'

import {Table,TableBody, TableCell, TableRow,Container, Input,Button } from "@mui/material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

import {auth} from '../firebase'

import { createUserWithEmailAndPassword } from 'firebase/auth';

import Logo from '../assets/logo.jpg'
import CinemaElk from "../assets/cinemaelk.jpg"
import { useNavigate } from 'react-router-dom';

export default function Signup(){
    const navigate=useNavigate()

    const[email,setEmail]=useState()
    const [password,setPassword]=useState()

    async function handleLogin(){
        if(!email && !password){
            alert('Please fill all fields')
            return
        }
        createUserWithEmailAndPassword(auth,email,password).then((userCredentials)=>{
            navigate('/')
        console.log(userCredentials)

              }).catch(err=>{
                console.log(err)
              })
    }

    return(
        <div style={{backgroundColor:' #ef5a22'}}>
            <Container >
            <Table>
                <TableBody>
                    <TableRow  >
                         
                        <TableCell>
                         
                          <img style={{height:'98vh',width:520,marginLeft:40}} src={Logo} alt="Logo" />
                          
                        </TableCell> 

                        <TableCell  style={{display:'flex',flexDirection:'column',marginTop:120}}>
                        <img style={{height:'16vh',width:"80%",marginBottom:12}} src={CinemaElk}/>
                        <div >
                         
                        <Input onChange={(e)=>setEmail(e.currentTarget.value)} disableUnderline  placeholder="Enter Email"  />
                      
                        <Input onChange={(e)=>setPassword(e.currentTarget.value)} disableUnderline  placeholder="Enter Password" type='password' />
                        <p style={{marginLeft:"15rem",marginTop:"0.3rem",color:"white"}}>password should be 8 digits</p>
                        
                        <Input style={{width: '93%',marginTop:18}} disableUnderline  placeholder="Enter Full Name" />
                        </div>
                        <Button 
                           onClick={handleLogin}
                           style={{width: '87%',  border: '1px solid white',  color: 'white', marginTop: 24,  borderRadius:0}} >
                           Join the club
                           <ArrowRightAltIcon />
                        </Button>

                        <div style={{marginTop:19,marginBottom:180,color:'white' ,textAlign:'center',marginRight:70}}>
                            Already a member?  <a style={{textDecoration:"underline",cursor:"pointer"}} onClick={()=>navigate('/login')}>Click here!</a>
                        </div>

                        </TableCell>

                    </TableRow>
                </TableBody>
            </Table>
            </Container>
        </div>
    )
}

