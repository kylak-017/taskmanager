import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TextField, Button } from '@mui/material';
// Import the functions you need from the SDKs you need


import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5shfSHuaEIYom0OeAjy8Qppkrivj8ND0",
  authDomain: "taskmanager-f333c.firebaseapp.com",
  projectId: "taskmanager-f333c",
  storageBucket: "taskmanager-f333c.appspot.com",
  messagingSenderId: "637162360901",
  appId: "1:637162360901:web:bfb56a3e7c6c490220132c",
  measurementId: "G-9Q221LJ1N1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async() => {
            const auth = getAuth(); //whattever was in the function getAuth()

            signInWithEmailAndPassword(auth, email, password) //function
                .then((userCredential) =>{
                    const user = userCredential.user;
                })
                .catch((error) =>{
                    const errorCode = error.code; //create variable
                    console.error("Error code:", errorCode);
                    const errorMessage = error.message;
                    console.log("Error message:", errorMessage);
                });
        
        
    }

  return (
    <div
        style={{
            backgroundColor: '#BBE2EC',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}
    >
        <Container maxWidth="lg">
            <Box
                sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                }}
            >
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 2,
                        fontWeight: 'bold'
                    }}
                >
                    Login
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                    width: 350,
                    height: 400,
                    borderRadius: 2,
                    backgroundColor: 'white',
                    boxShadow: 2,
                    padding: 2
                    }}
                >
                    <Typography
                        sx={{
                            color: 'rgb(196, 196, 196)',
                            fontWeight: 'bold',
                            fontSize: 13
                        }}
                    >
                        EMAIL
                    </Typography>
                    <TextField 
                        sx={{
                            border: 'none',
                            "& fieldset": { border: 'none' },
                            width: '100%',
                            backgroundColor: 'rgb(239, 239, 239)',
                            borderRadius: 1
                        }}
                        placeholder="Email"
                        variant='outlined'
                        value = {email}
                        onChange = {(element) => {
                            setEmail(element.target.value)
                        }}
                    />
                    <Typography
                        sx={{
                            marginTop: 3,
                            color: 'rgb(196, 196, 196)',
                            fontWeight: 'bold',
                            fontSize: 13
                        }}
                    >
                        PASSWORD
                    </Typography>
                    <TextField 
                        sx={{
                            border: 'none',
                            "& fieldset": { border: 'none' },
                            width: '100%',
                            backgroundColor: 'rgb(239, 239, 239)',
                            borderRadius: 1
                        }}
                        variant='outlined'
                        placeholder="Password"
                        onChange = {(element) => {
                            setPassword(element.target.value)
                        }}
                    />
                    <Button
                        variant="contained" 
                        sx={{
                            width: '100%',
                            marginTop: 2
                        }}
                    >
                        Login
                    </Button>
                </Box>
            </Box>
        </Container>
    </div>
  );
}