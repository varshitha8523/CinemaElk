import React, { use, useState } from 'react'

import './CSS/login.css'

import {Table,TableBody, TableCell, TableRow,Container, Input,Button } from "@mui/material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

import {auth} from '../firebase'

import {signInWithEmailAndPassword} from 'firebase/auth'

import Logo from '../assets/logo.jpg'
import CinemaElk from "../assets/cinemaelk.jpg"
import { useNavigate } from 'react-router-dom';

export default function Login(){

    const navigate=useNavigate()


    const [email,setEmail]=useState()
    const [password,setPassword]=useState()

    async function handleLogin(){
        if(!email && !password){
            alert('Please fill all fields')
            return
        }
        signInWithEmailAndPassword(auth,email,password).then((userCreds)=>{
        navigate('/')
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

                        <TableCell  style={{display:'flex',flexDirection:'column',marginTop:134}}>
                        <img style={{height:'16vh',width:"80%",marginBottom:12}} src={CinemaElk}/>
                        <div >
                         
                        <Input onChange={(e)=>setEmail(e.currentTarget.value)} disableUnderline  placeholder="Enter Email"  />
                        {/* <p>Password should be atleast 8 digits</p> */}
                        <Input onChange={(e)=>setPassword(e.currentTarget.value)} disableUnderline  placeholder="Enter Password" type='password' />

                        </div>
                        {/* <p style={{marginLeft:"15rem",marginTop:"0.3rem",color:"white"}}>password should be 8 digits</p> */}
                        <Button 
                           onClick={handleLogin}
                           style={{width: '87%',  border: '1px solid white',  color: 'white', marginTop: 24,  borderRadius:0}} >
                           Login Now
                           <ArrowRightAltIcon />
                        </Button>

                        <div  style={{marginTop:19,marginBottom:180,color:'white' ,textAlign:'center',marginRight:70}}>
                            Join the club , <a style={{textDecoration:'underline',cursor:"pointer"}} onClick={()=>navigate('/signup')}>Click here!</a>
                        </div>

                        </TableCell>

                    </TableRow>
                </TableBody>
            </Table>
            </Container>
        </div>
    )
}

