import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Login from "./routes/Login";
import Main from "./routes/Main";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import Register from "./routes/Register";
import Profile from "./routes/Profile"
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";

const router = createBrowserRouter([
  {
    path: "/login",
    element: 
    <RecoilRoot>
      <Login />
    </RecoilRoot>
    
  },
  {
    path: "/",
    element: 
    <RecoilRoot>
      <Main />
    </RecoilRoot>
  },
  {
    path: "register",
    element:
    <RecoilRoot>
     <Register />
     </RecoilRoot>
  },
  {
    path: "profile",
    element:
    <RecoilRoot>
     <Profile />
     </RecoilRoot>
  },


]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <RouterProvider router={router} />
  </ThemeProvider>
);