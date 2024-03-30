import React, { useState } from "react";
import { Container, Grid, Divider, Box, Typography } from "@mui/material";
import { AddCircleOutline } from '@mui/icons-material';

export default function Main() {

    const [tasks, setTasks] = useState([
        {
            title: 'Math',
            curPomodoro: 0,
            totalPomodoro: 2
        }
    ])

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
                            gap: 2
                        }}
                    >
                        {
                            tasks.map((el, ind) => (
                                <Box
                                    key={ind}
                                    component="section"
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: 'white',
                                        cursor: 'pointer',
                                        width: '100%',
                                        textAlign: 'center'
                                    }}>
                                    <Grid container justifyContent={'space-between'}>
                                        <Grid 
                                            item
                                            sx={{
                                                color: 'rgb(85, 85, 85)',
                                                fontWeight: 'bold',
                                                fontSize: 13
                                            }}
                                        >
                                            {el.title}
                                        </Grid>
                                        <Grid 
                                            item
                                            sx={{
                                                color: 'rgb(170, 170, 170)',
                                                fontWeight: 'bold',
                                                fontSize: 13
                                            }}
                                        >
                                            {el.curPomodoro}/{el.totalPomodoro}
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))
                        }

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
                            }}>
                            <Grid container justifyContent={'center'} alignItems={'center'}>
                                <AddCircleOutline
                                    sx={{
                                        color: 'white',
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
                                        color: '#ffffff'
                                    }}
                                >
                                    Task Manager
                                </Typography>
                            </Grid>
                        </Box>
                    </Grid>
                </Box>
            </Container>
        </div>
    )
}