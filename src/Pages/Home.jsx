import * as React from 'react';
import {Avatar,AppBar,Box,Toolbar,Typography,Button, Card, CardMedia, CardContent } from '@mui/material';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import VoiceChatOutlinedIcon from '@mui/icons-material/VoiceChatOutlined';

import Logo from '../assets/navlogo.jpg'
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import './CSS/Home.css'



const MOVIE_API="https://api.themoviedb.org/3/movie/now_playing?api_key=ef0c4658cfb2c174b10c7109705fdeb4&language=en-US&page=1"
const MOVIE_API2="https://api.themoviedb.org/3/movie/popular?api_key=ef0c4658cfb2c174b10c7109705fdeb4&language=en-US&page=1"
const MOVIE_API3="https://api.themoviedb.org/3/movie/top_rated?api_key=ef0c4658cfb2c174b10c7109705fdeb4&language=en-US&page=1"
const MOVIE_API4="https://api.themoviedb.org/3/movie/upcoming?api_key=ef0c4658cfb2c174b10c7109705fdeb4&language=en-US&page=1"
const IMAGE_API="https://image.tmdb.org/t/p/w500"


const Home = () => {
  const [movies,setMovies]=useState([])
  const [popularMovies,setPopularMovies]=useState([])
  const [topRatedMovies,setTopRatedMovies]=useState([])
  const [upcomingMovies,setUpcomingMovies]=useState([])
  const navigate=useNavigate()

  

  useEffect(()=>{
    axios.get(MOVIE_API).then((resp)=>{
        setMovies(resp.data.results)
        
    })
},[])

useEffect(()=>{
  axios.get(MOVIE_API2).then((resp)=>{
      setPopularMovies(resp.data.results)
      
  })
},[])

useEffect(()=>{
  axios.get(MOVIE_API3).then((resp)=>{
      setTopRatedMovies(resp.data.results)
      
    })
  },[])
  
  useEffect(()=>{
    axios.get(MOVIE_API4).then((resp)=>{
        setUpcomingMovies(resp.data.results)
        console.log(resp.data.results)
    })
  },[])
  
  
    function handleLogout(){
      signOut(auth)
      navigate('/')
  
  
    }
    return (
      <div>
        <Box sx={{ flexGrow: 1}}>
              <AppBar position="static" style={{backgroundColor:'white',color:'black',height:67,display:'flex',justifyContent:'center'}}>
                <Toolbar variant="dense">
                  <Avatar alt="Remy Sharp" src={Logo}/>
                  <Typography variant="h4" color="inherit" component="div" style={{marginLeft:"5px"}}>
                    <h6>CINEMA ELK</h6>
                </Typography>
                <Button style={{marginLeft:"160vh", backgroundColor: 'rgb(105, 76, 219) ',color:"white"}} onClick={handleLogout} >Logout</Button>
                
              </Toolbar>
            </AppBar>
          </Box>
          <div style={{display:'flex'}}>
          <Box sx={{ display: "flex", flexDirection: "column", height: "auto", minHeight: "100vh" }}>
  <AppBar
    position="static"
    style={{
      backgroundColor: "white",
      width: "80%",
      margin: 1.5,
      height: "auto", // ✅ Allows expansion when content grows
      display: "flex",
      flexDirection: "column",
      flexGrow: 1, // ✅ Helps it expand
    }}
  >
    <Toolbar
      variant="dense"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        paddingTop:"2rem"
      }}
    >
      <Avatar style={{marginBottom:"1rem"}}   sx={{ bgcolor: '#ef5a22', cursor: "pointer" }}>
        <HomeOutlinedIcon />
      </Avatar>
      <Avatar style={{marginBottom:"1rem"}}  onClick={() => navigate('/reviews')} sx={{ bgcolor: "rgb(105, 76, 219)", cursor: "pointer" }}>
        <VoiceChatOutlinedIcon />
      </Avatar>
      <Avatar style={{marginBottom:"1rem"}}  onClick={() => navigate("/user")} sx={{ bgcolor: 'rgb(105, 76, 219)', cursor: "pointer" }}>
        <PermIdentityOutlinedIcon />
      </Avatar>
    </Toolbar>
  </AppBar>
</Box>

    <div style={{display:'grid',gridTemplateRows:"8,1fr"}}>
        <h2 style={{marginLeft:'3rem',marginTop:'2rem'}}>NOW PLAYING</h2>
        

    <div className='movieList' >
            
    {movies.map(movie=>{
                return (
                 <div key={movie.id}>
                   <Card onClick={()=>navigate(`/movie/${movie.id}`,{state:movie})}  className='cardData' >
                      <CardMedia className='img' component="img" image={IMAGE_API + movie.poster_path} />
                      <CardContent >
                        <Typography variant="p" gutterBottom>
                          {movie.title}
                        </Typography>
                      </CardContent>
                   </Card>
                </div>
                )
            })}

    </div> 
    <h2 style={{marginLeft:'3rem',marginTop:'2rem'}}>POPULAR MOVIES</h2>
    <div className='movieList' >
            {popularMovies.map(popularMovie=>{
                return (
                 <div key={popularMovie.id}>
                   <Card onClick={()=>navigate(`/movie/${popularMovie.id}`,{state:popularMovie})} className='cardData' >
                      <CardMedia className='img' component="img" image={IMAGE_API + popularMovie.poster_path} />
                      <CardContent >
                        <Typography variant="p">
                          {popularMovie.title}
                        </Typography>
                      </CardContent>
                   </Card>
                   </div>
                )
            })}

    </div> 
    <h2 style={{marginLeft:'3rem',marginTop:'2rem'}}>TOP RATED</h2>
    <div className='movieList' >
            {topRatedMovies.map(topRatedMovie=>{
                return (
                 <div key={topRatedMovie.id}>
                   <Card onClick={()=>navigate(`/movie/${topRatedMovie.id}`,{state:topRatedMovie})} className='cardData' >
                      <CardMedia className='img' component="img" image={IMAGE_API + topRatedMovie.poster_path} />
                      <CardContent >
                        <Typography variant="p">
                          {topRatedMovie.title}
                        </Typography>
                      </CardContent>
                   </Card>
                </div>
                )
            })}
 
    </div> 
    <h2 style={{marginLeft:'3rem',marginTop:'2rem'}}>UPCOMING MOVIES</h2>
    <div className='movieList' >
            {upcomingMovies.map(upcomingMovie=>{
                return (
                 <div key={upcomingMovie.id}>
                   <Card onClick={()=>navigate(`/movie/${upcomingMovie.id}`,{state:upcomingMovie})} className='cardData' >
                      <CardMedia className='img' component="img" image={IMAGE_API + upcomingMovie.poster_path} />
                      <CardContent >
                        <Typography variant="p">
                          {upcomingMovie.title}
                        </Typography>
                      </CardContent>
                   </Card>
                </div>
                )
            })}

    </div> 

    </div>
    </div>   
    </div>
  )
}

export default Home     