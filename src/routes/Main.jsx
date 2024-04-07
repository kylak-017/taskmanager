import React from "react";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Settings } from "@mui/icons-material";
import { Assessment } from "@mui/icons-material";
import { Logout } from "@mui/icons-material";
import { TextField, Button } from '@mui/material';
import { Task } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import 'react-calendar-timeline/lib/Timeline.css';
import { useState, useEffect } from "react";
import { AddCircleOutline } from '@mui/icons-material';
import {Grid, Divider} from "@mui/material";


import { ArrowBackIos } from "@mui/icons-material";
import { ArrowForwardIos } from "@mui/icons-material";
import moment from 'moment';
import { setTokenAutoRefreshEnabled } from "firebase/app-check";

export default function Main() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const displaycurrentDate = currentDate.toLocaleDateString()

    const [timePomo, setTimePomo] = useState(1 );
    const [timeBreakS, setTimeBreakS] = useState(1 );
    const [timeBreakL, setTimeBreakL] = useState(1  );
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [version, setVersion] = useState('pomo');
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalVersion, setModalVersion] = useState('');
    const OpenModal = () => setModalOpen(true);
    const CloseModal = () => setModalOpen(false);
    

    const [isAutoTrue, setAutoTrue] = useState(false);
    const [tasks, setTasks] = useState([
        {
            title: 'Math',
            curPomodoro: 0,
            totalPomodoro: 2
        }
    ])

    const [completedPomos, setCompletedPomos] = useState(0);
    const [completedBreakS, setCompletedBreakS] = useState(0);
    const [completedBreakL, setCompletedBreakL] = useState(0);

    const decrementTime = (timeSetter, onComplete) => {
        timeSetter(time => {
            if (time > 0) return time - 1;
            onComplete();
            return 0; 
        });
    };
    
    

    useEffect(() => {
        if (!isAutoTrue || !isTimerActive) return;
    
        const decrementTime = (timeSetter, onComplete) => {
            timeSetter(time => {
                if (time > 0) return time - 1;
                onComplete();
                return 0; 
            });
        };
    
        if (version === 'pomo') {
            decrementTime(setTimePomo, () => {
                setCompletedPomos(completed => {
                    setIsTimerActive(true);
                    setVersion('shortBreak');
                    return completed + 1;
                });
            });
        } else if (version === 'shortBreak') {
            decrementTime(setTimeBreakS, () => {
                setCompletedBreakS(completed => {
                    if (completed + 1 === 4) {
                        setIsTimerActive(true);
                        setVersion('longBreak'); 
                    } else {
                        setIsTimerActive(true);
                        setVersion('pomo'); 
                    }
                    return completed + 1;
                });
            });
        } else if (version === 'longBreak') {
            decrementTime(setTimeBreakL, () => {
                setCompletedBreakL(completed => {
                    setVersion('pomo'); 
                    setIsTimerActive(true);
                    return completed + 1;
                });
            });
        }
    }, [isAutoTrue, isTimerActive, version]);
    
   

    useEffect(() => {
        let interval = null;
    
        if (isTimerActive) {
            interval = setInterval( () =>{
                switch(version){
                    case 'pomo':
                        if (timePomo === 0 ){
                            setVersion('shortBreak')

                        }
                        else{
                            setTimePomo(time => time > 0 ? time - 1 : 0);
                        }
                        break;
                    case 'shortBreak':
                        setTimeBreakS(time => time > 0 ? time - 1 : 0);
                        break;
                    case 'longBreak':
                        setTimeBreakL(time => time > 0 ? time - 1 : 0);
                        break;



                }
        
        }, 1000);
    }

         

    
        return () => {
        if(interval){
            clearInterval(interval);
        }
    };
    }, [timePomo, timeBreakS, timeBreakL, isTimerActive, version]);

    useEffect ( () => {
        if(version == 'pomo'){
            setMinutes(Math.floor(timePomo / 60));
            setSeconds(timePomo % 60);
        }
        else if (version == 'shortBreak'){
            setMinutes(Math.floor(timeBreakS / 60));
            setSeconds(timeBreakS % 60);
        }
        else if(version == 'longBreak'){
            setMinutes(Math.floor(timeBreakL / 60));
            setSeconds(timeBreakL % 60);
        }

    },[timePomo, timeBreakS, timeBreakL, version]);

     //useEffect used to handle changes

     const displayTimer = () =>{
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    const whichOne = (selectedVersion) =>{

        setIsTimerActive(false);
        switch (selectedVersion) {
            case 'pomo':
                setVersion('pomo');
                break;
            case 'shortBreak':
                setVersion('shortBreak');
                break;
            case 'longBreak':
                setVersion('longBreak');
                break;
        }

      
    }

    const whichModal = (whichModalVersion) =>{
        switch (whichModalVersion) {
            case 'settings':
                setModalVersion('settings');
                break;
            case 'report':
                setModalVersion('report');
                break;
            case 'logout':
                setModalVersion('logout');
                break;
        }

        
    }
    

     const toggleTimer = () => {
        setIsTimerActive(!isTimerActive);
    };

    

   


      const changeDateBack = () => {
        const previousDay = new Date(currentDate.getTime());
        previousDay.setDate(currentDate.getDate() - 1);
        setCurrentDate(previousDay);
    };

    const changeDateForward = () => {
        const nextDay = new Date(currentDate.getTime());
        nextDay.setDate(currentDate.getDate() + 1);
        setCurrentDate(nextDay);
    };

    function ViewProfile() {
        window.location.href = '/profile';
      }

    const Modal = ({ children, onClose }) => {
        return (
          <div style={modalStyle}>
            <div style={modalContentStyle}>
            <span style = {closeButtonStyle} onClick = {onClose}>  </span>
              {children} 
            </div>
          </div>
        ); //the children is specified when the function is used below, the content of the modal that is defined
      };

    const AutoStartTimer = () => {
        setAutoTrue(isAutoTrue);

    }




    const modalStyle = {
        position: 'fixed',
        zIndex: 1,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Black w/ opacity
    };
    
    const modalContentStyle = {
        backgroundColor: '#fefefe',
        margin: '15% auto',
        padding: '20px',
        border: '1px solid #888',
        width: '80%',
        maxWidth: '500px', // Could be any max-width
    };
    
    const closeButtonStyle = {
        color: '#aaa',
        float: 'right',
        fontSize: '28px',
        fontWeight: 'bold',
        cursor: 'pointer',
    };




    return (
        <>
            <div
                style = {{
                    backgroundColor: '#ba4949',
                    display: 'flex',
                    width: '100vw',
                    height: "100vh",
                }}
            
            >
                <Container>
                    <Box
                    sx = {{
                        marginBottom: 100,
                        height: 50,
                        width: '100vw',
                        alignItems: 'flex-start',

                        
                    }}
                    
                    >
                        <div 
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                textAlign: 'left',
                                marginTop: '10px'
    

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
                                    color: '#ffffff',
                                    textAlign:'left',
                                    marginRight: '450px'
                                }}
                            >
                                Task Manager

                            </Typography>





                
                            
                            <Button
                                onClick = {
                                    OpenModal
                                }
                            >
                                <Assessment
                                    sx = {{
                                        color: 'white',
                                        

                                    }}
                                />

                                
                                <Typography
                                    variant = "h5"
                                    sx = {{
                                        fontWeight: 'bold',
                                        color: "#ffffff"
                                    }}
                                >
                                    Report
                                </Typography>
                            </Button>

                                {isModalOpen && <Modal>

                                <Button 
                                onClick = { 
                                    CloseModal
                                    } 
                                sx = {{
                                    marginLeft: '390px',
                                    color: '#ba4949',
                                    fontSize: '20px',
                                    justifyContent: 'flex-end',
                                    
                                    }} 
                                >

                                <b>X</b> 
                                </Button>

                                <Typography>
                                    Completed Pomos: 
                                </Typography>
                                <Typography>
                                    {completedPomos}
                                </Typography>
                                </Modal>}

                           


                            <Button
                                onClick = {
                                    OpenModal
                             
                                }
                            >

                                <Settings
                                    sx = {{
                                        color: 'white'
                                    }}

                                />

                                <Typography
                                    variant = 'h5'
                                    sx = {{
                                        color: "#ffffff",
                                        fontWeight: 'bold',
                                        
                                    }}
                                >
                                    Settings
                                </Typography>

                            </Button>

                            {isModalOpen && <Modal>

                                <Button 
                                onClick = { 
                                    CloseModal

                                    
                                    } 
                                sx = {{
                                    marginLeft: '390px',
                                    color: '#ba4949',
                                    fontSize: '20px',
                                    justifyContent: 'flex-end',
                                    
                                    }} 
                                >

                                <b>X</b> 
                                </Button>

                                <Typography
                                    sx = {{
                                        color: '#ba4949',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '30px',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                    }}
                                >
                                    
                                    Settings
                                    
                                </Typography> 

                                <Typography
                                    sx = {{
                                        marginTop: '20px',
                                        color: '#403d3d',
                                        fontSize: '19px',
                                        fontWeight: 'bold',

                                    }}
                                >
                                    Change Your Password:
                                </Typography>

                                <Button
                                    onClick = {
                                        ViewProfile 
                                    }
                                    sx = {{
                                        marginTop: '15px',
                                        backgroundColor: '#b5aaa8',
                                        color: '#ffffff',
                                        fontWeight: 'bold',
                                    }}
                                >

                                    Change Password 

                                    
                                </Button>

                                <Typography
                                    sx = {{
                                        marginTop: '20px',
                                        color: '#403d3d',
                                        fontSize: '19px',
                                        fontWeight: 'bold',

                                    }}
                                >
                                    Timer Settings:
                                </Typography>

                                <Typography
                                    sx = {{
                                        marginTop: '20px',
                                        marginRight: '10px',
                                        color: '#b5aaa8',
                                        fontSize: '19px',
                                        display: 'inline-block',


                                    }}
                                >
                                    Auto Start Timer?:
                                </Typography>
        
                                <Button
                                    sx = {{
    
                                        backgroundColor: '#b5aaa8',
                                        color: '#ffffff',
                                        height: '30px',
                                        fontWeight: 'bold',

                                        
                               
                                    }}
                                    onClick = {
                                        AutoStartTimer
                                    }
                                >
                                    <p><b>{isAutoTrue ? 'No': 'Yes'}</b></p>

                                </Button>
                              
                               
                              



                         
                                    

                             

                               

                            </Modal>}

                            <Button>
                                <Logout
                                    sx = {{
                                        color: 'white'
                                    }}
                                />
                                <Typography
                                    variant = 'h5'
                                    sx = {{
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    
                                    Logout
                                </Typography>

                            </Button>

                    
                        

                       


                        


                    
                    

                        </div>

                       

                        

                        

                        
                    </Box>
                </Container>
                
                <Container>
                    <Button
                        sx = {{
                            position: 'absolute',
                            top: '20%',
                            left: '40%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'translate(-50%, -50%)'

                        }}
                        
                        onClick = {
                            changeDateBack
                        }
                    >
                        <ArrowBackIos
                            sx = {{
                                color: 'white',
                            }}
                        />
                      

                    </Button>
                    <Box
                        sx = {{
                            position: 'absolute',
                            top: '20%',
                            left: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'translate(-50%, -50%)'

                        }}
                    >
                        <p
                            style = {{
                                color: 'white',
                                
                            }}
                        > <b>
                            {displaycurrentDate}
                            </b>
                        </p>
                        
                    </Box>

                    <Button
                        sx = {{
                            position: 'absolute',
                            top: '20%',
                            left: '60%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'translate(-50%, -50%)'

                        }}
                        onClick={
                            changeDateForward
                        }
                    >
                        <ArrowForwardIos
                            sx = {{
                                color: 'white',
                            }}
                        />

                    </Button>
                </Container>

                <Container>
                    <Box
                        sx = {{
                            position: 'absolute',
                            top: '27%',
                            left: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'translate(-50%, -50%)'

                        }}
                    >
                  
                  
                        <Button
                            sx = {{
                                color: '#f77474',
                                backgroundColor: '#ffffff',
                                marignLeft: '5px',
                                marginRight: '5px'
                            }}
                            onClick = {
                                () => whichOne('pomo')
                            }
                        >
                            <b>Pomodoro </b>
                        </Button>
                        <Button
                            sx = {{
                            color: '#f77474',
                            backgroundColor: '#ffffff',
                            marignLeft: '5px',
                            marginRight: '5px'

                            }}
                            onClick = {
                                () => whichOne('shortBreak')
                            }
                        >
                           <b> Short Break</b>
                        </Button>
                        <Button
                             sx = {{
                                color: '#f77474',
                                backgroundColor: '#ffffff',
                                marignLeft: '5px',
                                marginRight: '5px'
                            }}

                            onClick = {
                                () => whichOne('longBreak')
                            }
                        >
                            <b>Long Break </b>
                        </Button>
                

                    </Box>
                </Container>

                <Container>
                     <Box 
                     sx = {{ 
                        position: 'fixed', // Fixed or absolute positioning
                        top: '50%', // Position halfway down the screen
                        left: '50%', // Position halfway across the screen
                        transform: 'translate(-50%, -50%)', // Offset the element by half its width and height
                        width: 300, 
                        height: 200,
                        borderRadius: 2,
        
                        display: 'flex',
                        alignItems: 'center', 
                        justifyContent: 'center', // Centers the text horizontally in the box
                        boxShadow: 2, 
                        padding: 2, 
                        backgroundColor: '#f77474' }} > 
                         

                            <div
                                style={{ 
                                    display: 'flex',
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    position: 'absolute', 
                                    left: 0, 
                                    right: 0, 
                                    }}
                            > 

                              
                                <Typography 
                                    variant="h1"
                                    sx = {{
                                        color: '#ffffff',
                                        position: 'absolute', 
                                        marginBottom: '100px' ,
                                        marginTop: '50px'
                                     
                                        
                                         }} >

                                        {displayTimer()}
                                 </Typography> 

                                 <Button
                                    sx = {{
                                     
                                        color: "#f77474",
                                        marginTop: '120px',
                                        backgroundColor: '#ffffff',
                                        height: '30px',
                                        width: '100px',
                                        
                               
                                    }}
                                    onClick = {
                                        toggleTimer
                                    }
                                >
                                    <p><b>{isTimerActive ? 'Pause': 'Start'}</b></p>

                                </Button>


                            </div>
                        </Box> 
                    </Container>

                
            </div>
        </>
    )
}