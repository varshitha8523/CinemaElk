import * as React from 'react';
import {Avatar,AppBar,Box,Toolbar,Typography,Button, Card,Input,Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import VoiceChatOutlinedIcon from '@mui/icons-material/VoiceChatOutlined';
import EditDocumentIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import Logo from '../assets/navlogo.jpg'
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { collection, getDocs, query, updateDoc, where,doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

const IMAGE_API="https://image.tmdb.org/t/p/w500"

const User = () => {
  const navigate=useNavigate()
  const [userData, setUserData] = useState([]); // Get user reviews from Firestore
  const [expandedReview, setExpandedReview] = useState(null); // Track expanded reviews
      const [showReviewForm, setShowReviewForm] = useState(false); // Toggle for review form
      const [review,setReview]=useState([])
          const [rating ,setRating]=useState("")
  



useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchUserFunction(user); // Pass the user object
    }
  });

  return () => unsubscribe(); // Cleanup function to avoid memory leaks
}, []);

const fetchUserFunction = async (user) => {
  try {
    const userRef = collection(db, "reviews");
    const q = query(userRef, where("userEmail", "==", user.email));
    const response = await getDocs(q);
    const userRefData = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUserData(userRefData);
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};




const handleReview = async () => {
  if (!review || !rating) {
    alert("Please enter both review and rating.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("User not authenticated.");
    return;
  }

  try {
    const reviewRef = doc(db, "reviews", showReviewForm); // Use `showReviewForm` as reviewId
    await updateDoc(reviewRef, {
      review: review,
      rating: rating,
      updatedAt: serverTimestamp(),
    });

    alert("Review updated successfully!");

    // Update local state (`userData`) immediately
    setUserData(prevData =>
      prevData.map(item =>
        item.id === showReviewForm ? { ...item, review, rating } : item
      )
    );

    // Reset fields
    setReview("");
    setRating("");
    setShowReviewForm(null); // Reset after submission
  } catch (error) {
    console.error("Error updating review:", error);
    alert("Failed to submit review. Try again later.");
  }
};

const handleDeleteReview = async (reviewId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this review?");
  if (!confirmDelete) return;

  try {
    // Delete review from Firestore
    await deleteDoc(doc(db, "reviews", reviewId));

    // Update UI: Remove deleted review from state
    setUserData(prevData => prevData.filter(item => item.id !== reviewId));

    alert("Review deleted successfully!");
  } catch (error) {
    console.error("Error deleting review:", error);
    alert("Failed to delete review. Try again later.");
  }
};



   function handleLogout(){
        signOut(auth)
        navigate('/')
    
    
      }

      const toggleReadMore = (id) => {
        setExpandedReview(expandedReview === id ? null : id);
      };
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
  <h1 style={{marginTop:15}}>My Reviews</h1> 
 <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
          width: "100%",
          marginBottom:"2rem"
          
        }}>
   {userData.map((user,id)=>{
       // Convert rating to stars
       const ratingValue = parseInt(user.rating);
       const safeRating = Math.max(0, Math.min(5, ratingValue)); // Ensure ratingValue is between 0 and 5
const stars = "★".repeat(safeRating) + "☆".repeat(5 - safeRating);


       // Extract the first letter from the user's email
       const firstLetter = user.userEmail.charAt(0).toUpperCase();
       const isExpanded = expandedReview === user.id;
       return(
        <div key={id} style={{ marginTop: "2rem"}}>
          <Card style={{ display:"flex",padding: 12 ,boxShadow:"none",border:"1px solid black",height:"auto",width:"90%"}}>
            <div style={{width:"70%",display:'flex',flexDirection:'column',justifyContent:"space-between"}}>
               <div style={{display:"flex",borderBottom:"1px solid black"}}>
               <Avatar sx={{ bgcolor: "#ef5a22", color: "white",marginBottom:1}}>
                 {firstLetter}
               </Avatar>
                <h1 style={{marginBottom:3,marginLeft:6}}>{user.userEmail.split("@")[0]}</h1>
                </div>
                <p style={{color: "#FFD700", fontSize: "20px" }}>{stars}</p>
                <p style={{ margin: "1rem 0", textAlign: "justify" }}>
                    {isExpanded ? user.review : `${user.review.split('.').slice(0, 2).join('.')}...`}
                  </p>
                  <div  style={{width:"70%",display:'flex',justifyContent:"space-between"}}>
                  <Button onClick={() => toggleReadMore(user.id)} style={{ alignSelf: 'start', backgroundColor: 'rgb(105, 76, 219) ', color: 'white',width:"50%" }}>
                    {isExpanded ? "Show Less" : "Read More"}
                  </Button>
                  <Avatar onClick={() => {
                          setShowReviewForm(user.id);
                           setReview(user.review); // Load existing review
                           setRating(user.rating); // Load existing rating
                         }}
                     sx={{ bgcolor: "rgb(243, 204, 64)", cursor: "pointer" }}>
                     <EditDocumentIcon />
                  </Avatar>


                   {/* Floating Review Form */}
                   <Dialog open={showReviewForm === user.id} onClose={() => setShowReviewForm(null)}>

                      <DialogTitle>Enter Your Review</DialogTitle>
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
                        <Button variant="contained" onClick={handleReview}>Submit</Button>


                        </DialogActions>
                      </Dialog>
                      <Avatar
  onClick={() => handleDeleteReview(user.id)}
  sx={{ bgcolor: "rgba(247, 3, 68, 0.95)", cursor: "pointer" }}
>
  <DeleteOutlinedIcon />
</Avatar>

                  </div>
                 </div>
             
              
              <div style={{marginLeft:"1rem"}}>
                 <img 
  src={IMAGE_API+user.poster_path} height={200} width={125}/>
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

export default User