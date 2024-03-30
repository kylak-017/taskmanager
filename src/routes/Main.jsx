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
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import { useState } from "react";


import { ArrowBackIos } from "@mui/icons-material";
import { ArrowForwardIos } from "@mui/icons-material";
import moment from 'moment';

export default function Main() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const displaycurrentDate = currentDate.toLocaleDateString()
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 12; hour <= 23; hour++) { // adjust start/end times as needed
          slots.push(moment({ hour }).format('h A'));
        }
        return slots;
      };
      
      const timeSlots = generateTimeSlots();

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





                
                            
                            <Button>
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


                            <Button>
                                <Settings
                                    sx = {{
                                        color: 'white'
                                    }}

                                />

                                <Typography
                                    variant = 'h5'
                                    sx = {{
                                        color: "#ffffff",
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Settings
                                </Typography>

                            </Button>

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
                            top: '25%',
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
                            top: '25%',
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
                            top: '25%',
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
                                    top: 0,
                                    left: 0, 
                                    right: 0, 
                                    bottom: 0, 
                                    }}
                            > 

                                <Button>

                                </Button>
                                <Typography 
                                    sx = {{
                                        color: '#ffffff',
                                         alignItems: 'center', 
                                         position: 'absolute',
                                         justifyContent: 'center'
                                         }} >
                                        Time 
                                 </Typography> 


                            </div>
                        </Box> 
                    </Container>

                   
                

                
          

          
            </div>
        </>
    )
}