import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TextField, Button } from '@mui/material';
import { Task } from '@mui/icons-material';
import { Link } from 'react-router-dom';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { configureStore } from 'redux';
import { Provider } from 'react-redux';
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

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");//for initializing a variable

    const register = async() => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code; //create variable
                console.error("Error code:", errorCode);
                const errorMessage = error.message;
                console.log("Error message:", errorMessage);
            });

    }

    const Confirm = () => {
        if(password != confirmPassword){
            alert("Password does not match.");
            return;
        }
        

        register();
    }

   


    

  return (
    <div
        style={{
            backgroundColor: '#ba4949',
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
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        marginBottom: 20
                    }}
                >
                    <Task 
                        sx={{
                            color: 'white',
                            fontSize: 50
                        }}
                    />
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: 'bold',
                            color: '#ffffff'
                        }}
                    >
                        Task Manager
                    </Typography>
                </div>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 2,
                        fontWeight: 'bold',
                        color: '#f3dbda'
                    }}
                >
                    Register
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
                        size="medium"
                        placeholder="example@mail.com"
                        variant='outlined'
                        onChange={(el) => {
                            setEmail(el.target.value)
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
                        size="medium"
                        variant='outlined'
                        placeholder="Password"
                        onChange={(el) => {
                            setPassword(el.target.value)
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
                        CONFIRM PASSWORD
                    </Typography>
                    <TextField 
                        sx={{
                            border: 'none',
                            "& fieldset": { border: 'none' },
                            width: '100%',
                            backgroundColor: 'rgb(239, 239, 239)',
                            borderRadius: 1
                        }}
                        size="medium"
                        variant='outlined'
                        placeholder="Confirm Password"
                        onChange={(el) => {
                            setConfirmPassword(el.target.value)
                        }}
                    />
                    <Button
                        variant="contained" 
                        sx={{
                            width: '100%',
                            marginTop: 2,
                            backgroundColor: '#383838',
                            fontWeight: 'bold'
                        }}
                        size="large"
                        onClick={() =>{
                            Confirm();
                        }}
                    >
                        Register With Email
                    </Button>
                    <div
                        style={{
                            textAlign: 'center',
                            
                        }}
                    >
                        Already have an account? {' '}
                        <Link 
                            to="/login"
                            style={{
                                textDecoration: 'none',
                                color: 'black',
                                fontWeight: 'bold'
                            }}
                        >
                            Login
                        </Link>
                    </div>
                </Box>
            </Box>
        </Container>
    </div>
  );
}