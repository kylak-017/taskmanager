
import React from "react"
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Task } from '@mui/icons-material';

import Box from '@mui/material/Box';
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';
import {emailAtom, passwordAtom } from "../recoil/Recoil";

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
{/* */}
function ProfileViewer() {
    // Use the hooks inside the component
    const email = useRecoilValue(emailAtom);
    const password = useRecoilValue(passwordAtom);
  
    // Render the email and password (though rendering password directly is not recommended for security reasons)
    return (
      <div>
        <p>Your Email: {email}</p>
        <p>Your Password: {password}</p> 
        <p>Change Password:</p>
      </div>
    );
  }





export default function Profile(){
   


       
     

    return (

        <div
            style = {{
                backgroundColor: '#ba4949',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }} >



              
            <ProfileViewer />


                
    
           

        </div>



    );

    
}