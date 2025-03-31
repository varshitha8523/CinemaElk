import * as React from 'react';
import {Avatar,AppBar,Box,Toolbar,Typography,Button, Card, CardMedia,Table,TableBody,TableRow,TableCell ,Input,Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import VoiceChatOutlinedIcon from '@mui/icons-material/VoiceChatOutlined';

import Logo from '../assets/navlogo.jpg'
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';


import { useLocation, useNavigate, useParams  } from 'react-router-dom'
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

const IMAGE_API="https://image.tmdb.org/t/p/w500"

const Movie = () => {

    const location=useLocation()
    const navigate=useNavigate()
    const { id } = useParams();
    const [movie, setMovie] = useState(location.state || null);

    const CASTCREW_API=`https://api.themoviedb.org/3/movie/${id}/credits?api_key=ef0c4658cfb2c174b10c7109705fdeb4&language=en-US`
    const SIMILAR_API=`https://api.themoviedb.org/3/movie/${id}/similar?api_key=ef0c4658cfb2c174b10c7109705fdeb4&language=en-US&page=1`

    const [castCrew,setCastCrew]=useState()
    const [similarMovies,setSimilarMovies]=useState([])
    const [review,setReview]=useState([])
    const [rating ,setRating]=useState("")
    const [showReviewForm, setShowReviewForm] = useState(false); // Toggle for review form
    const [users,setUsers]=useState([])
  
    useEffect(() => {
      if (!movie) {
          axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=ef0c4658cfb2c174b10c7109705fdeb4&language=en-US`)
              .then((resp) => setMovie(resp.data));
      }
  }, [id, movie]);

  useEffect(() => {
    if (id) {
        axios.get(CASTCREW_API)
            .then((resp) => setCastCrew(resp.data));
        axios.get( SIMILAR_API)
            .then((resp) => setSimilarMovies(resp.data.results));
    }
}, [id]);


    
    const handlePostReview = async () => {
      if (!review || !rating) {
        alert("Please enter both review and rating.");
        return;
      }
    
      const user = auth.currentUser; // Get the logged-in user
      
    
      try {
        const reviews = collection(db, "reviews");
        const newReview = {
          movieId: String(id), // Ensure movieId is a string
          title: movie?.title,
          review: review,
          rating: rating,
          poster_path: movie?.poster_path,
          userEmail: user.email
      };

        await addDoc(reviews, newReview);
    
        alert("Review submitted successfully!");
        setReview("");
        setRating("");
        setShowReviewForm(false);

         // Update the state immediately after posting the review
         setUsers((prevUsers) => [...prevUsers, newReview]);
        
        } catch (error) {
          console.error("Error posting review:", error);
          alert("Failed to submit review. Try again later.");
        }
      };
      
      useEffect(() => {
        
        const fetchFunction = async () => {
          try {
            const reviewRef = collection(db, "reviews");
            const q = query(reviewRef, where("movieId", "==",String(id)));
            const response = await getDocs(q);
      
            const reviewRefData = response.docs.map((doc) => doc.data()); 
            setUsers(reviewRefData); 
      
            console.log(reviewRefData); 
          } catch (error) {
            console.error("Error fetching reviews:", error);
          }
        };
      
        fetchFunction();
      }, [id]); 
         
      
      
      
      
  
      function handleLogout(){
        signOut(auth)
        navigate('/login')
    
    
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
      <Avatar style={{marginBottom:"1rem"}}  onClick={() => navigate('/')} sx={{ bgcolor: '#ef5a22', cursor: "pointer" }}>
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

      <Table>
        <TableBody>
            <TableRow style={{marginLeft:'6rem'}}>
                <TableCell style={{display:'flex',flexDirection:'column',borderBottom:'none'}}>
                <div style={{width:570, height: "auto", display:'flex', flexDirection:'column', justifyContent:"space-between"}}>

                    <img src={IMAGE_API+movie?.poster_path} height={380} width={350}/>
                    <p style={{fontSize:20}}>{movie?.title}</p>

                    <Button onClick={()=>setShowReviewForm(true)} style={{backgroundColor:' #ef5a22',color:'white',width:"40%",margin:"1rem 0"}} >
                      Post Review
                    </Button>
                    {/* Floating Review Form */}
                    <Dialog  open={showReviewForm} onClose={() => setShowReviewForm(false)}>
                      <DialogTitle>Enter Your Review Here</DialogTitle>
                      <DialogContent>
                        <Input
                           placeholder="Write your review..."
                           fullWidth
                            onChange={(e) => setReview(e.target.value)}
                           value={review}
                         />
                         <div style={{marginTop:1}}>Rating 
                        <Input
                         style={{width:"13%"}}
                          onChange={(e) => setRating(e.target.value)}
                          value={rating}
                         />
                         out of 5</div>
                       </DialogContent>
                       <DialogActions>
                        <Button onClick={() => setShowReviewForm(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handlePostReview}>Submit</Button>
                        </DialogActions>
                      </Dialog>
                    <h2>Movie Overview</h2>

                    <div style={{fontSize:17,textAlign:"justify"}}>
                        
                        {movie?.overview}
                    </div>

                    <h1>Cast & Crew</h1>
                     <div
                     
                     style={{

                       display: "flex",
                       overflowX: "auto",
                       scrollbarWidth: "none", // Hide scrollbar in Firefox
                       msOverflowStyle: "none", // Hide scrollbar in Edge/IE
                       
                     }}
                   >
                     
                    {castCrew?.cast.slice(0,10).map((cast,i)=>(
                        <div key={i} style={{margin:10}}>
                            <Avatar  src={IMAGE_API+cast.profile_path}/>
                            <p  style={{textAlign:'center'}}>{cast.name.split(" ")[0]}</p>
                        </div>
                    ))}
 {castCrew?.crew.slice(0,10).map((crew,i)=>(
                        <div key={i} style={{margin:10}}>
                            <Avatar src={IMAGE_API+crew.profile_path}/>
                            <p  style={{textAlign:'center'}}>{crew.name.split(" ")[0]}</p>
                        </div>
                    ))}

                    </div>
                    <h1>Similar Movies</h1>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)", justifyContent:"space-between", height: "auto"}}>

                   {similarMovies.map((similarMovie)=>{
                      return(
                        <div key={similarMovie.id}>
                        <Card style={{boxShadow:"none",margin:'0.3rem'}} >
                          <CardMedia style={{ width:'100%', height:'auto',borderRadius:' 9px'}} component="img" image={IMAGE_API+similarMovie.poster_path}/>
                          <p>{similarMovie.title.split(" ")[1]}</p>
                        </Card>
                        </div>
                      )

                    })}
                    </div>
                    </div>

</TableCell>  
<TableCell style={{borderLeft:"1px solid black",verticalAlign: "top"}} >

  <h1>Reviews By Cinema Elk Users</h1>
  
  {users.map((user, index) => {
      // Convert rating to stars
      const ratingValue = parseInt(user.rating);
      const safeRating = Math.max(0, Math.min(5, ratingValue)); // Ensure ratingValue is between 0 and 5
      const stars = "★".repeat(safeRating) + "☆".repeat(5 - safeRating);
      

      // Extract the first letter from the user's email
      const firstLetter = user.userEmail.charAt(0).toUpperCase();

      return (
           <div key={index} style={{ margin: "2rem", textAlign: "center" }}>
           <Card style={{ padding: 12 ,boxShadow:"none",borderBottom:"1px solid black"}}>
           <h4 style={{margin:"1rem",textAlign:"justify"}}>{user.review.split('.').slice(0, 2).join('.') + '.'}</h4>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Avatar sx={{ bgcolor: "#ef5a22", color: "white"}}>
                               {firstLetter}
                            </Avatar>
                            <h1>{user.userEmail.split("@")[0]}</h1>
                            <p style={{ marginLeft:200 ,color: "#FFD700", fontSize: "20px" }}>{stars}</p>
                          </div>
                          </Card>
                         </div>
                            );
                   })}

                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
    </div>
    </div>
  )
}

export default Movie       