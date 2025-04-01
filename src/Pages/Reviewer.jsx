import * as React from 'react';
import {Avatar,AppBar,Box,Toolbar,Typography,Button, Card, CardMedia,Table,TableBody,TableRow,TableCell ,Input,Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import VoiceChatOutlinedIcon from '@mui/icons-material/VoiceChatOutlined';

import Logo from '../assets/navlogo.jpg'

import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

import  { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

 
const IMAGE_API="https://image.tmdb.org/t/p/w500"
const Reviewer = () => {
  const navigate=useNavigate()
  const { userEmail } = useParams();
  const [reviewer,setReviewer]=useState([])
  const [expandedReview, setExpandedReview] = useState(null); // Track expanded reviews
  

   useEffect(() => {
          
          const fetchReviewerFunction = async () => {
            try {
              const reviewerRef = collection(db, "reviews");
              const q = query(reviewerRef, where("userEmail", "==",userEmail));
              const response = await getDocs(q);
        
              const reviewerRefData = response.docs.map((doc) => doc.data()); 
              setReviewer(reviewerRefData); 
        
              console.log(reviewerRefData); 
            } catch (error) {
              console.error("Error fetching reviews:", error);
            }
          };
        
          fetchReviewerFunction();
        }, [userEmail]); 
           
        function handleLogout(){
          signOut(auth)
          navigate('/')
      
      
        }

        const toggleReadMore = (id) => {
          setExpandedReview(expandedReview === id ? null : id);
        };
        return (
          <div >
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
      <Avatar style={{marginBottom:"1rem"}}  onClick={() => navigate('/home')} sx={{ bgcolor: '#ef5a22', cursor: "pointer" }}>
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

 <div style={{  width: "100%", marginLeft:'2rem'}}>
  <h1 style={{marginTop:15}}>Reviews Given By {userEmail.split("@")[0]}</h1> 
  <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
          width: "100%",
          marginBottom:"2rem"
        }}>
       
   {reviewer.map((review,id)=>{
       // Convert rating to stars
       const ratingValue = parseInt(review.rating);
       const safeRating = Math.max(0, Math.min(5, ratingValue)); // Ensure ratingValue is between 0 and 5
const stars = "★".repeat(safeRating) + "☆".repeat(5 - safeRating);


       // Extract the first letter from the user's email
       const firstLetter = review.userEmail.charAt(0).toUpperCase();
       const isExpanded = expandedReview === review.id;
       return(
        <div key={id} style={{ marginTop: "2rem"}}>
          <Card style={{ display:"flex",padding: 12 ,boxShadow:"none",border:"1px solid black",height:"auto",width:"90%"}}>
            <div style={{width:"70%",display:'flex',flexDirection:'column',justifyContent:"space-between"}}>
               <div style={{display:"flex",borderBottom:"1px solid black"}}>
               <Avatar  sx={{ bgcolor: "#ef5a22", color: "white",marginBottom:1}}>
                 {firstLetter}
               </Avatar>
                <h1 style={{marginBottom:3,marginLeft:6}}>{review.userEmail.split("@")[0]}</h1>
                </div>
                <p style={{color: "#FFD700", fontSize: "20px" }}>{stars}</p>
                <p style={{ margin: "1rem 0", textAlign: "justify" }}>
                    {isExpanded ? review.review : `${review.review.split('.').slice(0,1).join('.')}...`}
                  </p>
                  <Button onClick={() => toggleReadMore(review.id)} style={{ alignSelf: 'start', backgroundColor: 'rgb(105, 76, 219) ', color: 'white',width:"50%" }}>
                    {isExpanded ? "Show Less" : "Read More"}
                  </Button>
                 </div>
             
              
              <div style={{marginLeft:"1rem"}}>
                 <img 
  src={IMAGE_API+review.poster_path} height={200} width={125}/>
               </div>
             
           </Card>
        </div>
        );
        
      
    })}
    </div>
    </div>
    </div>   
  </div>
)
  
}

    
export default Reviewer