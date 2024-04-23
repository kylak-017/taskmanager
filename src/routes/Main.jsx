import React, { useState, useEffect, useRef } from "react";
import { Container, Grid, Divider, Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, CircularProgress } from "@mui/material";
import { AddCircleOutline, CheckCircleOutline, CheckCircle, MoreVert, Settings, Assessment, Logout, Task, ArrowBackIos, ArrowForwardIos, CloseOutlined } from '@mui/icons-material';
import { Form, Link } from "react-router-dom";
import 'react-calendar-timeline/lib/Timeline.css';
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import { setTokenAutoRefreshEnabled } from "firebase/app-check";
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';
import logo from '../assets/logo.png';
import { emailAtom, passwordAtom } from "../recoil/Recoil";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import Webcam from "react-webcam";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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
const db = getFirestore(app);

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);



export default function Main() {

    const [tasks, setTasks] = useState([])
    const [addingTask, setAddingTask] = useState(false);
    const [newName, setNewName] = useState("");
    const [newPomodoros, setNewPomodoros] = useState(0);
    const [newDifficulty, setNewDifficulty] = useState("");
    const [editingTask, setEditingTask] = useState(-1);
    const [editName, setEditName] = useState("");
    const [editCurPom, setEditCurPom] = useState(0);
    const [LogEmail, setLogEmail] = useRecoilState(emailAtom);
    const [LogPw, setLogPw] = useRecoilState(emailAtom);
    const [infoModal, setInfoModal] = useState(true);

    const [currentDate, setCurrentDate] = useState(new Date());
    const displaycurrentDate = currentDate.toLocaleDateString()

    const [timePomo, setTimePomo] = useState(25 * 60);
    const [timeBreakS, setTimeBreakS] = useState(5 * 60);
    const [timeBreakL, setTimeBreakL] = useState(15 * 60);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [version, setVersion] = useState('pomo');
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const [totPomCompleted, setTotPomCompleted] = useState(0);
    const [favSubject, setFavSubject] = useState('');
    const [focusTrend, setFocusTrend] = useState('');
    const [numDays, setNumDays] = useState(0);

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalVersion, setModalVersion] = useState('');
    const OpenModal = () => setModalOpen(true);
    const CloseModal = () => setModalOpen(false);
    const webcamRef = useRef(null);
    const [reportLoading, setReportLoading] = useState(false);
    const [pomLoading, setPomLoading] = useState(false);


    const [isAutoTrue, setAutoTrue] = useState(true);

    const [completedPomos, setCompletedPomos] = useState(0);
    const [completedBreakS, setCompletedBreakS] = useState(0);
    const [completedBreakL, setCompletedBreakL] = useState(0);
    const [curDocId, setCurDocId] = useState("");
    const [dataNeed, setDataNeed] = useState([]);
    const [labels, setLabels] = useState([])
    const navigate = useNavigate();

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Pomodoros Completed Trend',
            },
        },
    };



    const data = {
        labels,
        datasets: [
            {
                label: 'Pomodoros',
                data: dataNeed,
                borderColor: 'rgb(34, 99, 255)',
                backgroundColor: 'rgba(20, 30, 255, 240)',
            }
        ],
    };

    function findMostFrequent(textArray) {
        // Create an object to hold the count of each text
        const occurrences = {};
        let mostFrequentText = null;
        let maxCount = 0;

        // Iterate through each text in the array
        for (const text of textArray) {
            // Increment the count for each text in the occurrences object
            occurrences[text] = (occurrences[text] || 0) + 1;

            // Check if this count is the highest so far
            if (occurrences[text] > maxCount) {
                maxCount = occurrences[text];
                mostFrequentText = text;
            }
        }

        // Return the text with the highest occurrence
        return mostFrequentText;
    }

    function calculateBestFitSlope(numbers) {
        // Initialize variables for the sum of x, y, x*y, and x^2
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumX2 = 0;

        // Calculate the length of the numbers array
        const n = numbers.length;

        // Iterate through the array and calculate sums
        for (let i = 0; i < n; i++) {
            const x = i; // The index is the x value
            const y = numbers[i]; // The current number is the y value

            // Calculate sums
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumX2 += x * x;
        }

        // Calculate the mean (average) values of x and y
        const meanX = sumX / n;
        const meanY = sumY / n;

        // Calculate the slope using the formula
        const numerator = sumXY - n * meanX * meanY;
        const denominator = sumX2 - n * meanX * meanX;

        const slope = numerator / denominator;

        // Return the calculated slope
        return slope;
    }

    const getAllData = async () => {
        var tasks = localStorage.getItem('tasks')
        var tempEmail = localStorage.getItem('email')
        setReportLoading(true);
        const q = query(collection(db, "tasks"), where("email", "==", tempEmail), orderBy('date'));
        const querySnapshot = await getDocs(q);
        var tempArray = []
        var totalPomodoro = 0
        var days = 0
        var dateArray = []
        var tempOutput = []
        var subjects = []
        var trend = []
        querySnapshot.forEach((doc) => {
            var data = doc.data()
            var tempDict = {
                id: doc.id,
                data: JSON.parse(data['data']),
                date: data['date']
            }
            var pomData = JSON.parse(data['data'])
            var tempPom = 0
            days += 1
            dateArray.push(data['date'])
            var count = 0
            var tempPomCompleted = 0
            pomData.forEach((el, ind) => {
                totalPomodoro += parseInt(el['curPomodoro'])
                subjects.push(el['title'])
                tempPom += parseInt(el['totalPomodoro'])
                count += 1
                tempPomCompleted += parseInt(el['curPomodoro'])
            })
            trend.push((tempPom / count))
            tempArray.push(tempDict)
            tempOutput.push(tempPomCompleted)
        });
        var favoriteSubject = findMostFrequent(subjects)
        var slope = calculateBestFitSlope(trend);
        setTotPomCompleted(totalPomodoro);
        setFavSubject(favoriteSubject);
        if (slope > 0) {
            setFocusTrend("Increasing")
        }
        else {
            setFocusTrend("Decreasing")
        }
        setNumDays(days)
        setLabels(dateArray)
        setDataNeed(tempOutput)
        setReportLoading(false);

    }

    const capture = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        // Send the image to the Flask server
        const response = await fetch('https://technovationbackend-d7d391d697d1.herokuapp.com/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageSrc }),
        });
        if (response.ok) {
            const data = await response.json();
            var prediction = data['prediction'];
            console.log(prediction)
            var tempEmail = localStorage.getItem('email')
            const newData = [...tasks];
            const index = newData.findIndex(item => item.curPomodoro != item.totalPomodoro);
            if (index != -1) {
                const docRef = await addDoc(collection(db, "focus"), {
                    prediction: prediction,
                    email: tempEmail,
                    subject: newData[index]['title'],
                    date: new Date()
                });
            }
        }

    }


    useEffect(() => {
        var tempEmail = localStorage.getItem('email')
        if (!tempEmail) {
            navigate("/login")
        }
    }, [])

    const changeFinished = async (id, newFinished) => {
        // Get a copy of the data array
        const newData = [...tasks];

        // Find the index of the object with the given id
        const index = newData.findIndex(item => item.id === id);

        if (index !== -1) {
            // Update the name property of the object at the found index
            newData[index] = { ...newData[index], finished: newFinished };

            // Update the state with the modified array
            setTasks(newData);
            // localStorage.setItem('tasks', JSON.stringify(newData));

            var tempEmail = localStorage.getItem('email');
            await setDoc(doc(db, "tasks", curDocId), {
                data: JSON.stringify(newData),
                email: tempEmail,
                date: displaycurrentDate
            });
        }
    }

    const updatePomodoro = async () => {
        // Get a copy of the data array
        const newData = [...tasks];

        // Find the index of the object with the given id
        console.log(newData)
        const index = newData.findIndex(item => item.curPomodoro != item.totalPomodoro);

        console.log(index)
        if (index !== -1) {
            var current_pomodoro = parseInt(newData[index].curPomodoro) + 1
            // Update the name property of the object at the found index
            newData[index] = { ...newData[index], curPomodoro: current_pomodoro.toString() };
            // Update the state with the modified array
            setTasks(newData);
            // localStorage.setItem('tasks', JSON.stringify(newData));
            var tempEmail = localStorage.getItem('email');
            await setDoc(doc(db, "tasks", curDocId), {
                data: JSON.stringify(newData),
                email: tempEmail,
                date: displaycurrentDate
            });
        }
    }

    const removeItem = async (indexToRemove) => {
        // Create a copy of the current state array
        const updatedItems = [...tasks];
        // Remove the element at the specified index
        updatedItems.splice(indexToRemove, 1);
        // Update the state with the modified array
        setTasks(updatedItems);
        // localStorage.setItem('tasks', JSON.stringify(updatedItems));
        var tempEmail = localStorage.getItem('email');
        await setDoc(doc(db, "tasks", curDocId), {
            data: JSON.stringify(updatedItems),
            email: tempEmail,
            date: displaycurrentDate
        });
    };

    useEffect(() => {
        const getTasks = async () => {
            setPomLoading(true);
            var tasks = localStorage.getItem('tasks')
            var tempEmail = localStorage.getItem('email')
            const q = query(collection(db, "tasks"), where("email", "==", tempEmail), where("date", '==', displaycurrentDate));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                setCurDocId("");
                setTasks([]);
            }
            else {
                querySnapshot.forEach((doc) => {
                    var data = doc.data()
                    setCurDocId(doc.id);
                    setTasks(JSON.parse(data['data']))
                });
            }
            setPomLoading(false);
        }
        getTasks();
    }, [currentDate])

    const addNewTask = async () => {
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
        var tempEmail = localStorage.getItem('email');
        // Add a new document in collection "cities"
        // Add a new document with a generated id.
        if (curDocId) {
            await setDoc(doc(db, "tasks", curDocId), {
                data: JSON.stringify(newData),
                email: tempEmail,
                date: displaycurrentDate
            });
        }
        else {
            const docRef = await addDoc(collection(db, "tasks"), {
                data: JSON.stringify(newData),
                email: tempEmail,
                date: displaycurrentDate
            });
        }
        // await setDoc(doc(db, "tasks", tempEmail), {
        //     data: JSON.stringify(newData)
        // });

        // Update the state with the modified array
        setTasks(newData);
        // localStorage.setItem('tasks', JSON.stringify(newData));

        setAddingTask(false);
        setNewName("");
        setNewPomodoros(0);
        setNewDifficulty("");
    }

    const editItem = async (oldTaskInfo) => {
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
        // localStorage.setItem('tasks', JSON.stringify(updatedItems));
        var tempEmail = localStorage.getItem('email');
        await setDoc(doc(db, "tasks", curDocId), {
            data: JSON.stringify(updatedItems),
            email: tempEmail,
            date: displaycurrentDate
        });
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
                        if (timePomo === 0) {
                            updatePomodoro();
                        }
                        if (timePomo % 300 == 0) {
                            capture();
                        }
                        if (timePomo === 0 && isAutoTrue) {
                            setCompletedPomos(completedPomos + 1);
                            const newData = [...tasks];

                            // Find the index of the object with the given id
                            console.log(newData)
                            const index = newData.findIndex(item => item.curPomodoro != item.totalPomodoro);

                            if (index !== -1) {
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
                                alert("You have finished all your pomodoros.");
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

    const toggleTimer = () => {

        navigator.permissions.query({ name: 'camera' })
            .then((permissionObj) => {
                if (permissionObj.state == 'denied') {
                    alert("You need to allow camera permissions to get pomodoro recommendations.")
                }
            })
            .catch((error) => {
                console.log('Got error :', error);
            });

        const newData = [...tasks];

        // Find the index of the object with the given id
        console.log(newData)
        const index = newData.findIndex(item => item.curPomodoro != item.totalPomodoro);

        if (index !== -1) {
            setIsTimerActive(!isTimerActive);
        }
        else {
            alert("No more pomodoros left to run.");
        }
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

    const recommendPomodoros = async () => {
        if (newName == "") {
            alert("Please select a subject.");
            return;
        }
        else if (newDifficulty == "") {
            alert("Please select how difficult this subject is.")
            return;
        }
        var tasks = localStorage.getItem('tasks')
        var tempEmail = localStorage.getItem('email')
        setReportLoading(true);
        const q = query(collection(db, "focus"), where("email", "==", tempEmail), where("subject", "==", "newName"), orderBy('date', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        var tempArray = []
        var totalPomodoro = 0
        var days = 0
        var dateArray = []
        var tempOutput = []
        var subjects = []
        var trend = []
        if (querySnapshot.empty) {
            alert("You need to finish one pomodoro with this subject to get a recommendation.")
        }
        else {
            var newFocus = ""
            querySnapshot.forEach((doc) => {
                var data = doc.data()
                if (data['prediction'] == 0) {
                    newFocus = "High"
                }
                else {
                    newFocus = "Low"
                }
            });
            const response = await fetch('https://technovationbackend-d7d391d697d1.herokuapp.com/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "subject": newName,
                    "focus": newFocus,
                    "difficulty": newDifficulty
                }),
            });
            const data = await response.json()
            setNewPomodoros(data.recommendation)
        }
    }

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
        backgroundColor: '#f6f6f6',
        margin: '1% auto',
        padding: '20px',
        border: '1px solid #888',
        width: '80%',
        maxWidth: '750px', // Could be any max-width
        borderRadius: '10px'
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
                backgroundColor: '#4050b5',
                minHeight: '100vh'
            }}
        >
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                style={{
                    visible: 'hidden',
                    position: 'absolute',
                    zIndex: -1
                }}
            />
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
                            display: 'flex',
                            alignItems: 'center',
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
                            variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                color: '#ffffff',
                                textAlign: 'left',
                            }}
                        >
                            Balance Boost

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
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                getAllData();
                                OpenModal();
                            }}
                        >
                            <Assessment
                                sx={{
                                    color: 'white',
                                }}
                            />

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'bold',
                                    color: "#ffffff"
                                }}
                            >
                                Report
                            </Typography>
                        </div>
                        {/* <div
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

                        </div> */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                localStorage.removeItem('email');
                                localStorage.removeItem('password');
                                navigate('/login')
                            }}
                        >
                            <Logout
                                sx={{
                                    color: 'white'
                                }}
                            />
                            <Typography
                                variant='h6'
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
                            color: version == 'pomo' ? '#ffffff' : '#78a6eb',
                            backgroundColor: version == 'pomo' ? '#78a6eb' : '#ffffff',
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
                            color: version == 'shortBreak' ? '#ffffff' : '#78a6eb',
                            backgroundColor: version == 'shortBreak' ? '#78a6eb' : '#ffffff',
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
                            color: version == 'longBreak' ? '#ffffff' : '#78a6eb',
                            backgroundColor: version == 'longBreak' ? '#78a6eb' : '#ffffff',
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
                            backgroundColor: '#5964e3'
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
                                    color: "#78a6eb",
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
                            item xs={18}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
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
                    {
                        pomLoading ?
                            <div
                                style={{
                                    width: '100%',
                                    textAlign: 'center'
                                }}
                            >
                                <CircularProgress
                                    sx={{
                                        color: 'white'
                                    }}
                                />
                            </div>
                            :
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
                                                key={ind}
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
                                                                    color: el.curPomodoro == el.totalPomodoro ? 'rgb(76, 73, 255)' : 'rgb(223, 223, 223)',
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
                                                <FormControl
                                                    fullWidth
                                                    style={{
                                                        marginBottom: 20
                                                    }}
                                                >

                                                    <InputLabel id="difficultylabel">How difficult is this for you?</InputLabel>
                                                    <Select
                                                        labelId="difficultylabel"
                                                        id="difficulty"
                                                        value={newDifficulty}
                                                        label="How difficult is this for you?"
                                                        onChange={(e) => {
                                                            setNewDifficulty(e.target.value)
                                                        }}
                                                    >
                                                        <MenuItem value="">
                                                            <em>None</em>
                                                        </MenuItem>
                                                        <MenuItem value={"Easy"}>Easy</MenuItem>
                                                        <MenuItem value={"Medium"}>Medium</MenuItem>
                                                        <MenuItem value={"Difficult"}>Difficult</MenuItem>
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
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 30
                                                    }}
                                                >
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
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 'rgb(34, 34, 34)',
                                                            fontSize: 12,
                                                            fontWeight: '600',
                                                            mt: 2
                                                        }}
                                                        onClick={() => {
                                                            recommendPomodoros()
                                                        }}
                                                    >
                                                        Get Recommendation
                                                    </Button>
                                                </div>
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
                    }

                </Box>
            </Container>
            {isModalOpen && <Modal>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}
                >
                    <CloseOutlined
                        onClick={() => {
                            CloseModal()
                        }}
                        style={{
                            cursor: 'pointer'
                        }}
                    />
                </div>
                {
                    reportLoading ?
                        <div
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                marginTop: 30
                            }}
                        >
                            <CircularProgress />
                        </div>
                        :
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: 20,
                                    padding: 20
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: 'white',
                                        flex: 1,
                                        height: 80,
                                        padding: 20,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        borderRadius: 15
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            color: '#1f2124'
                                        }}
                                    >
                                        Total Pomodoros Completed
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 30,
                                            fontWeight: 'bold',
                                            color: '#1f2124'
                                        }}
                                    >
                                        {totPomCompleted}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        backgroundColor: 'white',
                                        flex: 1,
                                        height: 80,
                                        padding: 20,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        borderRadius: 15
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            color: '#1f2124'
                                        }}
                                    >
                                        Favorite Subject
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 30,
                                            fontWeight: 'bold',
                                            color: '#1f2124'
                                        }}
                                    >
                                        {favSubject}
                                    </div>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: 20,
                                    padding: 20
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: 'white',
                                        flex: 1,
                                        height: 80,
                                        padding: 20,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        borderRadius: 15
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            color: '#1f2124'
                                        }}
                                    >
                                        Focus Trend
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 30,
                                            fontWeight: 'bold',
                                            color: '#1f2124'
                                        }}
                                    >
                                        {focusTrend}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        backgroundColor: 'white',
                                        flex: 1,
                                        height: 80,
                                        padding: 20,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        borderRadius: 15
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            color: '#1f2124'
                                        }}
                                    >
                                        Number of Days
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 30,
                                            fontWeight: 'bold',
                                            color: '#1f2124'
                                        }}
                                    >
                                        {numDays}
                                    </div>
                                </div>
                            </div>
                            <Line options={options} data={data} />
                        </div>
                }
            </Modal>}
            {infoModal && <Modal>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 20
                    }}
                >
                    <div
                        style={{
                            fontSize: 25,
                            fontWeight: 'bold'
                        }}
                    >
                        Instructions
                    </div>
                    <CloseOutlined
                        onClick={() => {
                            setInfoModal(false);
                        }}
                        style={{
                            cursor: 'pointer'
                        }}
                    />
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: 10,
                        marginBottom: 20
                    }}
                >
                    <div
                        style={{
                            fontWeight: 'bold'
                        }}
                    >
                        1.
                    </div>
                    <div>
                    When you open the app, you will be instructed to register or login. If you have an account already, login right away. If not, click on the register button.
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: 10,
                        marginBottom: 20
                    }}
                >
                    <div
                        style={{
                            fontWeight: 'bold'
                        }}
                    >
                        2.
                    </div>
                    <div>
                    After you log in, you will be able to see a pop-up to allow the video webcam. Enable it so that your focus and attention level can be tracked through your eye movements.
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: 10,
                        marginBottom: 20
                    }}
                >
                    <div
                        style={{
                            fontWeight: 'bold'
                        }}
                    >
                        3.
                    </div>
                    <div>
                    To start on a task, click on the “Add task” button and set up the category your task falls under, along with the estimated pmodoro sessions. The pomdoro session is a cycle of 25 minutes of work and a 5 minute break. The long break will start after 4 cycle of pomodoro, and it will last 15 minutes.
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: 10,
                        marginBottom: 20
                    }}
                >
                    <div
                        style={{
                            fontWeight: 'bold'
                        }}
                    >
                        4.
                    </div>
                    <div>
                    To get a recommendation  on the # of pomodoros, click on the “Get reccomendation” button.
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: 10,
                        marginBottom: 20
                    }}
                >
                    <div
                        style={{
                            fontWeight: 'bold'
                        }}
                    >
                        5.
                    </div>
                    <div>
                    After you are done with the tasks for the day, you can click on the “report” button to get a detailed analysis of how you spend your time, which includes your most frequently chosen subject, the focus trend (based on # of tasks and eye movement), total pomodoros completed, and number of days recorded. There is a graph that details this trend using a day-by-day analysis.
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: 10,
                        marginBottom: 20
                    }}
                >
                    <div
                        style={{
                            fontWeight: 'bold'
                        }}
                    >
                        6.
                    </div>
                    <div>
                    After you are done, you can choose to logout by clicking on the 'logout' button.
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: 10,
                        marginBottom: 20
                    }}
                >
                    <div
                        style={{
                            fontWeight: 'bold'
                        }}
                    >
                        7.
                    </div>
                    <div>
                    If there are any inquiries, please feel free to fill out the following form: <a href='https://forms.gle/joCsumzmjVofugic7' target="_blank">Google Form</a>
                    </div>
                </div>
            </Modal>}
        </div>
    )
}