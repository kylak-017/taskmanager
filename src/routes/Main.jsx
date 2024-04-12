import React, { useState, useEffect } from "react";
import { Container, Grid, Divider, Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { AddCircleOutline, CheckCircleOutline, CheckCircle, MoreVert, Settings, Assessment, Logout, Task, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Form, Link } from "react-router-dom";
import 'react-calendar-timeline/lib/Timeline.css';

import moment from 'moment';
import { setTokenAutoRefreshEnabled } from "firebase/app-check";


export default function Main() {

    const [tasks, setTasks] = useState([])
    const [addingTask, setAddingTask] = useState(false);
    const [newName, setNewName] = useState("");
    const [newPomodoros, setNewPomodoros] = useState(0);
    const [editingTask, setEditingTask] = useState(-1);
    const [editName, setEditName] = useState("");
    const [editCurPom, setEditCurPom] = useState(0);

    const [currentDate, setCurrentDate] = useState(new Date());
    const displaycurrentDate = currentDate.toLocaleDateString()

    const [timePomo, setTimePomo] = useState(0.1 * 60);
    const [timeBreakS, setTimeBreakS] = useState(5 * 60);
    const [timeBreakL, setTimeBreakL] = useState(15 * 60);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [version, setVersion] = useState('pomo');
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalVersion, setModalVersion] = useState('');
    const OpenModal = () => setModalOpen(true);
    const CloseModal = () => setModalOpen(false);


    const [isAutoTrue, setAutoTrue] = useState(true);

    const [completedPomos, setCompletedPomos] = useState(0);
    const [completedBreakS, setCompletedBreakS] = useState(0);
    const [completedBreakL, setCompletedBreakL] = useState(0);

    const changeFinished = (id, newFinished) => {
        // Get a copy of the data array
        const newData = [...tasks];

        // Find the index of the object with the given id
        const index = newData.findIndex(item => item.id === id);

        if (index !== -1) {
            // Update the name property of the object at the found index
            newData[index] = { ...newData[index], finished: newFinished };

            // Update the state with the modified array
            setTasks(newData);
            localStorage.setItem('tasks', JSON.stringify(newData));
        }
    }

    const removeItem = (indexToRemove) => {
        // Create a copy of the current state array
        const updatedItems = [...tasks];
        // Remove the element at the specified index
        updatedItems.splice(indexToRemove, 1);
        // Update the state with the modified array
        setTasks(updatedItems);
        localStorage.setItem('tasks', JSON.stringify(updatedItems));
    };

    useEffect(() => {
        var tasks = localStorage.getItem('tasks')
        if (tasks) {
            console.log(tasks)
            setTasks(JSON.parse(tasks))
        }
    }, [])

    const addNewTask = () => {
        // Get a copy of the data array
        const newData = [...tasks];

        // Generate a new unique id (you can use a better method for generating ids)
        const newId = Math.max(...newData.map(item => item.id), 0) + 1;

        // Create a new dictionary and append it to the array
        newData.push({
            id: newId,
            title: newName,
            curPomodoro: 0,
            totalPomodoro: newPomodoros,
            finished: false
        });

        // Update the state with the modified array
        setTasks(newData);
        localStorage.setItem('tasks', JSON.stringify(newData));

        setAddingTask(false);
        setNewName("");
        setNewPomodoros(0);
    }

    const editItem = (oldTaskInfo) => {
        // Create a copy of the current state array
        const updatedItems = tasks.map(item => {
            // Check if the current item's ID matches the ID to edit
            if (item.id === oldTaskInfo.id) {
                // Modify the item
                return { ...item, title: editName, curPomodoro: editCurPom };
            }
            return item;
        });
        // Update the state with the modified array
        setTasks(updatedItems);
        localStorage.setItem('tasks', JSON.stringify(updatedItems));
        setEditName("")
        setEditCurPom(0)
        setEditingTask(-1);
    };



    useEffect(() => {
        let interval = null;


        if (isTimerActive) {
            interval = setInterval(() => {
                switch (version) {
                    case 'pomo':
                        if (timePomo === 0 && isAutoTrue) {
                            setCompletedPomos(completedPomos + 1);
                            if (completedPomos === 4) {
                                setVersion('longBreak');
                                setTimePomo(1);
                                break;

                            }
                            else {
                                setVersion('shortBreak');
                                setTimePomo(1);
                                break;
                            }

                        }

                        else {
                            setTimePomo(time => time > 0 ? time - 1 : 0);
                        }

                        break;
                    case 'shortBreak':
                        if (timeBreakS === 0 && isAutoTrue) {
                            setVersion('pomo')
                            setTimeBreakS(2);
                            break;

                        }
                        else {
                            setTimeBreakS(time => time > 0 ? time - 1 : 0);
                        }

                        break;
                    case 'longBreak':
                        if (timeBreakL === 0 && isAutoTrue) {
                            setVersion('pomo')
                            setTimeBreakL(3);
                            break;

                        }
                        else {
                            setTimeBreakL(time => time > 0 ? time - 1 : 0);

                        }
                        break;




                }

            }, 1000);
        }




        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [timePomo, timeBreakS, timeBreakL, isTimerActive, version]);

    useEffect(() => {
        if (version == 'pomo') {
            setMinutes(Math.floor(timePomo / 60));
            setSeconds(timePomo % 60);
        }
        else if (version == 'shortBreak') {
            setMinutes(Math.floor(timeBreakS / 60));
            setSeconds(timeBreakS % 60);
        }
        else if (version == 'longBreak') {
            setMinutes(Math.floor(timeBreakL / 60));
            setSeconds(timeBreakL % 60);
        }

    }, [timePomo, timeBreakS, timeBreakL, version]);

    //useEffect used to handle changes

    const displayTimer = () => {
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    const whichOne = (selectedVersion) => {

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

    const whichModal = (whichModalVersion) => {
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
                    <span style={closeButtonStyle} onClick={onClose}>  </span>
                    {children}
                </div>
            </div>
        ); //the children is specified when the function is used below, the content of the modal that is defined
    };

    const AutoStartTimer = () => {
        setAutoTrue(!isAutoTrue);

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
        <div
            style={{
                backgroundColor: '#ba4949',
                height: '100vh',
            }}
        >
            <div>
                <div
                    style={{
                        display: 'flex',
                        gap: 30,
                        justifyContent: 'space-between',
                        padding: 20
                    }}
                >
                    <div
                        style={{
                            display: 'flex'
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
                                textAlign: 'left',
                            }}
                        >
                            Task Manager

                        </Typography>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 30
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            onClick={
                                OpenModal
                            }
                        >
                            <Assessment
                                sx={{
                                    color: 'white',
                                }}
                            />

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 'bold',
                                    color: "#ffffff"
                                }}
                            >
                                Report
                            </Typography>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            onClick={
                                OpenModal
                            }
                        >

                            <Settings
                                sx={{
                                    color: 'white'
                                }}

                            />

                            <Typography
                                variant='h5'
                                sx={{
                                    color: "#ffffff",
                                    fontWeight: 'bold',

                                }}
                            >
                                Settings
                            </Typography>

                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Logout
                                sx={{
                                    color: 'white'
                                }}
                            />
                            <Typography
                                variant='h5'
                                sx={{
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                            >
                                Logout
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>


            <Container maxWidth="xs">
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Button
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',

                        }}

                        onClick={
                            changeDateBack
                        }
                    >
                        <ArrowBackIos
                            sx={{
                                color: 'white',
                            }}
                        />


                    </Button>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',

                        }}
                    >
                        <p
                            style={{
                                color: 'white',

                            }}
                        > <b>
                                {displaycurrentDate}
                            </b>
                        </p>

                    </Box>

                    <Button
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',

                        }}
                        onClick={
                            changeDateForward
                        }
                    >
                        <ArrowForwardIos
                            sx={{
                                color: 'white',
                            }}
                        />

                    </Button>
                </div>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',

                    }}
                >
                    <Button
                        sx={{
                            color: version == 'pomo' ? '#ffffff' : '#f77474',
                            backgroundColor: version == 'pomo' ? '#f77474' : '#ffffff', 
                            marignLeft: '5px',
                            marginRight: '5px'
                        }}
                        onClick={
                            () => whichOne('pomo')
                        }
                    >
                        <b>Pomodoro </b>
                    </Button>
                    <Button
                        sx={{
                            color: version == 'shortBreak' ? '#ffffff' : '#f77474',
                            backgroundColor: version == 'shortBreak' ? '#f77474' : '#ffffff', 
                            marignLeft: '5px',
                            marginRight: '5px'

                        }}
                        onClick={
                            () => whichOne('shortBreak')
                        }
                    >
                        <b> Short Break</b>
                    </Button>
                    <Button
                        sx={{
                            color: version == 'longBreak' ? '#ffffff' : '#f77474',
                            backgroundColor: version == 'longBreak' ? '#f77474' : '#ffffff', 
                            marignLeft: '5px',
                            marginRight: '5px'
                        }}

                        onClick={
                            () => whichOne('longBreak')
                        }
                    >
                        <b>Long Break </b>
                    </Button>
                </Box>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20
                    }}
                >
                    <Box
                        sx={{
                            width: 300,
                            height: 200,
                            borderRadius: 2,

                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center', // Centers the text horizontally in the box
                            boxShadow: 2,
                            padding: 2,
                            backgroundColor: '#f77474'
                        }} >


                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >


                            <Typography
                                variant="h1"
                                sx={{
                                    color: '#ffffff',
                                    position: 'absolute',
                                    marginBottom: '100px',
                                    marginTop: '50px'


                                }} >

                                {displayTimer()}
                            </Typography>

                            <Button
                                sx={{

                                    color: "#f77474",
                                    marginTop: '120px',
                                    backgroundColor: '#ffffff',
                                    height: '30px',
                                    width: '100px',


                                }}
                                onClick={
                                    toggleTimer
                                }
                            >
                                <p><b>{isTimerActive ? 'Pause' : 'Start'}</b></p>

                            </Button>


                        </div>
                    </Box>
                </div>
                <Box
                    component={'section'}
                    sx={{
                        p: 2
                    }}
                >
                    <Grid container>
                        <Grid
                            item xs={6}
                        >
                            <div
                                style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: 'white'
                                }}
                            >
                                Tasks
                            </div>
                        </Grid>
                    </Grid>
                    <Divider
                        style={{
                            border: '1px solid rgba(255, 255, 255, 0.6)',
                            marginTop: 10,
                            marginBottom: 10
                        }}
                    />
                    <Grid
                        container
                        sx={{
                            gap: 1
                        }}
                    >
                        {
                            tasks.map((el, ind) => (
                                ind == editingTask ?
                                    <Box
                                        component="section"
                                        sx={{
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            width: '100%',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <div
                                            style={{
                                                padding: 20
                                            }}
                                        >
                                            <FormControl
                                                fullWidth
                                                style={{
                                                    marginBottom: 20
                                                }}
                                            >
                                                <InputLabel id="editBox">What are you studying?</InputLabel>
                                                <Select
                                                    labelId="editBox"
                                                    id="editBox"
                                                    value={editName}
                                                    label="What are you studying?"
                                                    onChange={(e) => {
                                                        setEditName(e.target.value)
                                                    }}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    <MenuItem value={"Math"}>Math</MenuItem>
                                                    <MenuItem value={"Science"}>Science</MenuItem>
                                                    <MenuItem value={"Literature"}>Literature</MenuItem>
                                                    <MenuItem value={"History"}>History</MenuItem>
                                                    <MenuItem value={"Computer Science"}>Computer Science</MenuItem>
                                                    <MenuItem value={"Art"}>Art</MenuItem>
                                                    <MenuItem value={"Geography"}>Geography</MenuItem>
                                                    <MenuItem value={"Music"}>Music</MenuItem>
                                                    <MenuItem value={"Physics"}>Physics</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 10
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        flex: 1
                                                    }}
                                                >
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            textAlign: 'left',
                                                            color: 'rgb(85, 85, 85)'
                                                        }}
                                                    >
                                                        Current Pomodoro
                                                    </Typography>
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{
                                                            border: 'none',
                                                            "& fieldset": { border: 'none' },
                                                            borderRadius: 1,
                                                            backgroundColor: '#efefef',
                                                            width: '100%',
                                                            mt: 2
                                                        }}
                                                        inputProps={{
                                                            style: {
                                                                fontWeight: '900',
                                                                color: 'rgb(85, 85, 85)'
                                                            }
                                                        }}
                                                        type="number"
                                                        value={editCurPom}
                                                        onChange={(element) => {
                                                            setEditCurPom(element.target.value)
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        flex: 1
                                                    }}
                                                >
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            textAlign: 'left',
                                                            color: 'rgb(85, 85, 85)'
                                                        }}
                                                    >
                                                        Target Pomodoros
                                                    </Typography>
                                                    <TextField
                                                        disabled
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{
                                                            border: 'none',
                                                            "& fieldset": { border: 'none' },
                                                            borderRadius: 1,
                                                            backgroundColor: '#efefef',
                                                            width: '100%',
                                                            mt: 2
                                                        }}
                                                        inputProps={{
                                                            style: {
                                                                fontWeight: '900',
                                                                color: 'rgb(85, 85, 85)'
                                                            }
                                                        }}
                                                        type="number"
                                                        value={el.totalPomodoro}
                                                        onChange={(element) => {
                                                            setNewPomodoros(element.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                backgroundColor: '#efefef',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                borderBottomLeftRadius: 8,
                                                borderBottomRightRadius: 8,
                                                padding: 10
                                            }}
                                        >
                                            <div>
                                                <Button
                                                    variant="text"
                                                    color="error"
                                                    size="small"
                                                    sx={{
                                                        fontSize: 12,
                                                        fontWeight: 'bold',
                                                        mr: 1
                                                    }}
                                                    onClick={() => {
                                                        removeItem(ind)
                                                        setEditName("")
                                                        setEditCurPom(0)
                                                        setEditingTask(-1);
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                            <div>
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    sx={{
                                                        color: 'rgb(136, 136, 136)',
                                                        fontSize: 12,
                                                        fontWeight: 'bold',
                                                        mr: 1
                                                    }}
                                                    onClick={() => {
                                                        setEditName("")
                                                        setEditCurPom(0)
                                                        setEditingTask(-1);
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'rgb(34, 34, 34)',
                                                        fontSize: 12,
                                                        fontWeight: '600'
                                                    }}
                                                    onClick={() => {
                                                        editItem(el)
                                                    }}
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    </Box>
                                    :
                                    <Box
                                        key={ind}
                                        component="section"
                                        sx={{
                                            px: 1,
                                            py: 2,
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                            width: '100%',
                                            textAlign: 'center'
                                        }}>
                                        <Grid
                                            container
                                            justifyContent={'space-between'}
                                            alignItems={'center'}
                                        >
                                            <Grid
                                                item
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex'
                                                    }}
                                                >
                                                    <CheckCircle
                                                        sx={{
                                                            color: el.curPomodoro == el.totalPomodoro ? 'rgb(186, 73, 73)' : 'rgb(223, 223, 223)',
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        color: 'rgb(85, 85, 85)',
                                                        fontWeight: 'bold',
                                                        fontSize: 15,
                                                        marginLeft: 5
                                                    }}
                                                >
                                                    {el.title}
                                                </div>
                                            </Grid>
                                            <Grid
                                                item
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        color: 'rgb(170, 170, 170)',
                                                        fontWeight: 'bold',
                                                        fontSize: 13
                                                    }}
                                                >
                                                    {el.curPomodoro}/{el.totalPomodoro}
                                                </div>
                                                <div
                                                    onClick={() => {
                                                        setEditName(el.title)
                                                        setEditCurPom(el.curPomodoro)
                                                        setEditingTask(ind);
                                                    }}
                                                >
                                                    <MoreVert
                                                        sx={{
                                                            marginLeft: 0.5,
                                                            borderRadius: 2,
                                                            ":hover": {
                                                                backgroundColor: 'rgba(0, 0, 0, 0.3)'
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Box>
                            ))
                        }
                        {
                            addingTask ?
                                <Box
                                    component="section"
                                    sx={{
                                        borderRadius: 2,
                                        backgroundColor: 'white',
                                        width: '100%',
                                        textAlign: 'left',
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: 20
                                        }}
                                    >
                                        <FormControl
                                            fullWidth
                                            style={{
                                                marginBottom: 20
                                            }}
                                        >
                                            <InputLabel id="demo-simple-select-label">What are you studying?</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={newName}
                                                label="What are you studying?"
                                                onChange={(e) => {
                                                    setNewName(e.target.value)
                                                }}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value={"Math"}>Math</MenuItem>
                                                <MenuItem value={"Science"}>Science</MenuItem>
                                                <MenuItem value={"Literature"}>Literature</MenuItem>
                                                <MenuItem value={"History"}>History</MenuItem>
                                                <MenuItem value={"Computer Science"}>Computer Science</MenuItem>
                                                <MenuItem value={"Art"}>Art</MenuItem>
                                                <MenuItem value={"Geography"}>Geography</MenuItem>
                                                <MenuItem value={"Music"}>Music</MenuItem>
                                                <MenuItem value={"Physics"}>Physics</MenuItem>
                                            </Select>
                                        </FormControl>
                                        {/* <TextField 
                                        sx={{
                                            border: 'none',
                                            "& fieldset": { border: 'none' },
                                            width: '100%',
                                            borderRadius: 1,
                                        }}
                                        inputProps={{
                                            style: {
                                                fontWeight: '900',
                                                paddingLeft: 0,
                                                paddingRight: 0,
                                                color: 'rgb(85, 85, 85)'
                                            }
                                        }}
                                        size="medium"
                                        placeholder="What are you studying?"
                                        variant='outlined'
                                        value={newName}
                                        onChange = {(element) => {
                                            setNewName(element.target.value)
                                        }}
                                    /> */}
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 'bold',
                                                textAlign: 'left',
                                                color: 'rgb(85, 85, 85)'
                                            }}
                                        >
                                            Est. Pomodoros
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                border: 'none',
                                                "& fieldset": { border: 'none' },
                                                borderRadius: 1,
                                                backgroundColor: '#efefef',
                                                width: '30%',
                                                mt: 2
                                            }}
                                            inputProps={{
                                                style: {
                                                    fontWeight: '900',
                                                    color: 'rgb(85, 85, 85)'
                                                }
                                            }}
                                            type="number"
                                            value={newPomodoros}
                                            onChange={(element) => {
                                                setNewPomodoros(element.target.value)
                                            }}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            backgroundColor: '#efefef',
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            borderBottomLeftRadius: 8,
                                            borderBottomRightRadius: 8,
                                            padding: 10
                                        }}
                                    >
                                        <Button
                                            variant="text"
                                            size="small"
                                            sx={{
                                                color: 'rgb(136, 136, 136)',
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                                mr: 1
                                            }}
                                            onClick={() => {
                                                setAddingTask(false)
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            sx={{
                                                backgroundColor: 'rgb(34, 34, 34)',
                                                fontSize: 12,
                                                fontWeight: '600'
                                            }}
                                            onClick={() => {
                                                addNewTask()
                                            }}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </Box>
                                :
                                <Box
                                    component="section"
                                    sx={{
                                        p: 2,
                                        border: '2px dashed rgba(255, 255, 255, 0.4)',
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                        cursor: 'pointer',
                                        width: '100%',
                                        textAlign: 'center',
                                        ":hover": {
                                            backgroundColor: 'rgba(0, 0, 0, 0.2)'
                                        }
                                    }}
                                    onClick={() => {
                                        setAddingTask(!addingTask)
                                    }}
                                >
                                    <Grid container justifyContent={'center'} alignItems={'center'}>
                                        <AddCircleOutline
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.4)',
                                                fontSize: 20
                                            }}
                                            style={{
                                                marginRight: 2
                                            }}
                                        />
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: 'rgba(255, 255, 255, 0.4)',
                                            }}
                                        >
                                            Add Task
                                        </Typography>
                                    </Grid>
                                </Box>
                        }

                    </Grid>
                </Box>
            </Container>
            {isModalOpen && <Modal>

                <Button
                    onClick={
                        CloseModal
                    }
                    sx={{
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


            {isModalOpen && <Modal>

                <Button
                    onClick={
                        CloseModal


                    }
                    sx={{
                        marginLeft: '390px',
                        color: '#ba4949',
                        fontSize: '20px',
                        justifyContent: 'flex-end',

                    }}
                >

                    <b>X</b>
                </Button>
                <Typography
                    sx={{
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
                    sx={{
                        marginTop: '20px',
                        color: '#403d3d',
                        fontSize: '19px',
                        fontWeight: 'bold',

                    }}
                >
                    Change Your Password:
                </Typography>
                <Button
                    onClick={
                        ViewProfile
                    }
                    sx={{
                        marginTop: '15px',
                        backgroundColor: '#b5aaa8',
                        color: '#ffffff',
                        fontWeight: 'bold',
                    }}
                >

                    Change Password
                </Button>
                <Typography
                    sx={{
                        marginTop: '20px',
                        color: '#403d3d',
                        fontSize: '19px',
                        fontWeight: 'bold',

                    }}
                >
                    Timer Settings:
                </Typography>
                <Typography
                    sx={{
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
                    sx={{

                        backgroundColor: '#b5aaa8',
                        color: '#ffffff',
                        height: '30px',
                        fontWeight: 'bold',



                    }}
                    onClick={
                        AutoStartTimer
                    }
                >
                    <p><b>{isAutoTrue ? 'No' : 'Yes'}</b></p>
                </Button>
            </Modal>}
        </div>
    )
}