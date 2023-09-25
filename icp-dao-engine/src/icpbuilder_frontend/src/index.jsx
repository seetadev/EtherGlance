import * as React from "react";
import { render } from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'
import Home from "./routes/Home";
import "../assets/main.css";
import Dashboard from "./routes/Dashboard";
import theme from "./theme";
import NewApp from "./routes/NewApp";
import Application from "./routes/Application";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/new-app",
    element: <NewApp />,
  },
  {
    path: "/application/:appId",
    element: <Application />,
  },
]);

render(
  <ChakraProvider theme={theme}>
    <RouterProvider router={router} />
  </ChakraProvider>,
  document.getElementById("app")
);
