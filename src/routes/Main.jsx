import React, { useState, useEffect } from "react";
import { Container, Grid, Divider, Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { AddCircleOutline, CheckCircleOutline, CheckCircle, MoreVert } from '@mui/icons-material';
import { Form } from "react-router-dom";

export default function Main() {

    const [tasks, setTasks] = useState([])
    const [addingTask, setAddingTask] = useState(false);
    const [newName, setNewName] = useState("");
    const [newPomodoros, setNewPomodoros] = useState(0);
    const [editingTask, setEditingTask] = useState(-1);
    const [editName, setEditName] = useState("");
    const [editCurPom, setEditCurPom] = useState(0);

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
            <Container maxWidth="xs">
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
                                                    onClick={() => {
                                                        changeFinished(el.id, !el.finished)
                                                    }}
                                                >
                                                    <CheckCircle
                                                        sx={{
                                                            color: el.finished ? 'rgb(186, 73, 73)' : 'rgb(223, 223, 223)',
                                                            ':hover': {
                                                                opacity: 0.6
                                                            }
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
        </div>
    )
}