import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TextField, Button } from '@mui/material';


export default function Root() {
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
                    />
                    <Typography
                        sx={{
                            marginTop: 3,
                            color: 'rgb(196, 196, 196)',
                            fontWeight: 'bold'
                        }}
                    >
                        Password
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