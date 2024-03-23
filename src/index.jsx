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
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);