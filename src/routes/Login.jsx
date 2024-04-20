import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TextField, Button } from '@mui/material';
import { Task } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
// Import the functions you need from the SDKs you need


import { initializeApp } from "firebase/app";
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';
import { emailAtom, passwordAtom } from "../recoil/Recoil";
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

    const [LogEmail, setLogEmail] = useRecoilState(emailAtom);
    const [LogPw, setLogPw] = useRecoilState(emailAtom);

    const navigate = useNavigate();

    useEffect(() => {
        var tempEmail = localStorage.getItem('email')
        console.log(tempEmail)
        if(tempEmail)
        {
            navigate("/")
        }
    }, [])


    const login = async () => {

        signInWithEmailAndPassword(auth, email, password) //the email parameter is derived from the getemail
            .then((userCredential) => {
                const user = userCredential.user;
                setLogEmail(emailAtom);
                setLogPw(passwordAtom); //after login is confirmed, email and password parameter is saved to the respective atoms for recoil state
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
                navigate('/')
            })
            .catch((error) => {
                const errorCode = error.code; //create variable
                console.error("Error code:", errorCode);
                const errorMessage = error.message;
                console.log("Error message:", errorMessage);
            });


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
                            marginBottom: 20,
                            gap: 10
                        }}
                    >
                        <img 
                            src={logo}
                            alt="logo"
                            style={{
                                height: 50,
                                width: 50,
                                borderRadius: 10
                            }}
                        />
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 'bold',
                                color: '#ffffff'
                            }}
                        >
                            Balance Boost
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
                            size="medium"
                            placeholder="example@mail.com"
                            variant='outlined'
                            value={email}
                            onChange={(element) => {
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
                            size="medium"
                            variant='outlined'
                            placeholder="Password"
                            onChange={(element) => {
                                setPassword(element.target.value)
                            }}
                            type='password'
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
                            onClick={() => {
                                login();
                            }}
                        >
                            Login With Email
                        </Button>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 20
                            }}
                        >
                            <div
                                style={{
                                    borderTop: 'solid #ebebeb 1px',
                                    width: '40%',
                                }}
                            >
                            </div>
                            <div
                                style={{
                                    color: '#d6d6d6',
                                    fontSize: 18
                                }}
                            >
                                or
                            </div>
                            <div
                                style={{
                                    borderTop: 'solid #ebebeb 1px',
                                    width: '40%',
                                }}
                            >
                            </div>
                        </div>
                        <div
                            style={{
                                textAlign: 'center',
                                marginTop: 10
                            }}
                        >
                            Don't have an account? {' '}
                            <Link
                                to="/register"
                                style={{
                                    textDecoration: 'none',
                                    color: 'black',
                                    fontWeight: 'bold'
                                }}
                            >
                                Register
                            </Link>
                        </div>
                    </Box>
                </Box>
            </Container>
        </div>
    );
}