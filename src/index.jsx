import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Login from "./routes/Login";
import Root from "./routes/Root";
import Register from "./routes/Register";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "register",
    element: <Register />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);