import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase-config';

firebase.initializeApp(firebaseConfig);


function App() { 
  const [user,setUser]= useState({
    isSignedin : false,
    name:'',
    email:'',
    photo:'',
    
  })
  

  const provider = new firebase.auth.GoogleAuthProvider();
  const handlesignin = ()=>{
    firebase.auth().signInWithPopup(provider)
    .then(res=>{
     const{displayName,email,photoURL}=res.user;
     const signedInUser ={
       isSignedin : true,
       name: displayName,
       email: email,
       photo: photoURL
     }
     setUser(signedInUser);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
    
  }

  const handlesignOut = ()=>{
    firebase.auth().signOut()
    .then(res => {
      const signOutuser = {
        isSignedin:false,
        name:'',
        email:'',
        photo:'',
        password:'',
        error:'',
        is_valid:false,
        existingUser:false
      }
      setUser(signOutuser);
    })
    .catch(err=>{

    })
  }

  
  const  is_valid_email = email =>  /^.+@.+\..+$/.test(email); 
  const hasNumber = myString => /\d/.test(myString);

  const switchBox = event => {
    const creatUser = {...user};
    creatUser.existingUser = event.target.checked;
    creatUser.error = '';
    setUser(creatUser)
  }

  const handleReader = event =>{
    const newUserInfo ={
      ...user
    };
     let is_valid = true;
    if(event.target.name === 'email'){
      is_valid=is_valid_email(event.target.value)
    }
    if(event.target.name === 'password'){
      is_valid = event.target.value.length > 8 && hasNumber(event.target.value)
    }
    newUserInfo[event.target.name]=event.target.value
    newUserInfo.is_valid = is_valid;
    setUser(newUserInfo);
  }

  const handlecreate = (event) =>{
    if(user.is_valid){
      firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
    .then(res=>{
      console.log(res)
      const createdUser ={ ...user}
      createdUser.isSignedin=true;
      createdUser.error='';
      setUser(createdUser);
    })
    .catch(err =>{
      console.log(err.message);
      const createdUser ={ ...user}
      createdUser.isSignedin=false;
      createdUser.error=err.message;
      setUser(createdUser);
    })
    }
    event.preventDefault();
    event.target.reset();
  }

  const signInuser = event =>{
    if(user.is_valid){
      firebase.auth().signInWithEmailAndPassword(user.email,user.password)
    .then(res=>{
      console.log(res)
      const createdUser ={ ...user}
      createdUser.isSignedin=true;
      createdUser.error='';
      setUser(createdUser);
    })
    .catch(err =>{
      console.log(err.message);
      const createdUser ={ ...user}
      createdUser.isSignedin=false;
      createdUser.error=err.message;
      setUser(createdUser);
    })
    }
    event.preventDefault();
    event.target.reset();
  }
  return (
    <div className="App">
    
     {
       user.isSignedin && <p>Welcome, {user.name}</p>
     }
     
     {
       user.isSignedin ?  <button onClick={handlesignOut}>Sign out</button>:
       <button onClick={handlesignin}>Sign in</button>
     }

     <h1>our own authentication</h1>
     <br/>
     <input type="checkbox" name="switchBox" onChange={switchBox} id="switchBox"/>
     <label htmlFor="switchBox">Already signed in?</label>

     <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInuser}>
     <input onBlur={handleReader} type="email" name="email" placeholder="your email" required id=""/>
     <br/>
     <input onBlur={handleReader} type="password" name="password" placeholder="your password" required id=""/>
     <br/>
     <input type="submit" value="sign in"/>
     </form>


     <form style={{display:user.existingUser ? 'none' : 'block'}} onSubmit={handlecreate}>
     <input onBlur={handleReader} type="text" name="name" placeholder="your name" required id=""/>
     <br/>
     <input onBlur={handleReader} type="email" name="email" placeholder="your email" required id=""/>
     <br/>
     <input onBlur={handleReader} type="password" name="password" placeholder="your password" required id=""/>
     <br/>
     <input type="submit" value="Creat Account"/>
     </form>
     {
       user.error && <p><small style={{color:'red'}}>action failed</small></p>
     }
    </div>
    );
  }

export default App;
