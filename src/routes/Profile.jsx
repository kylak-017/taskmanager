import { Typography } from "@mui/material";
import React from "react"
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';
import {emailAtom, passwordAtom } from "../recoil/Recoil";

export default function Profile(){
    const useEmail= selector({ //Can be used when the user clicks on their profile to view their email
        key: "useEmail",
        get: ({get}) => {
            const email = get(emailAtom);

            return email;

        }
    })

    const usePassword= selector({ //Can be used when the user clicks on their profile to view their email
        key: "usePW",
        get: ({get}) => {
            const PW = get(passwordAtom);

            return PW;

        }
    })

    const profieViewer = () => {
        const comp1 = useRecoilValue(useEmail);
        const comp2 = useRecoilValue(usePassword);

        return <>Your Email: {comp1} 
        <br></br>
        Your Password: {comp2}
        </>;

    }

    return (

        <div
            style = {{
                backgroundColor: '#ba4949',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }} >

                <ul>
                    <li>View Profile</li>
                    <li>View Stats</li>
                    <li>View Achievements</li>
                </ul>

                <Conatiner>
                    
                    <Box>
                        <Task>
                            
                        </Task>
                        <Typography>
                            {profileViewer()}
                            
                        </Typography>
                        <Button>
                            Change Password
                        </Button>
                    </Box>
                </Conatiner>

        </div>



    );

    
}