import {createBrowserRouter, RouterProvider} from "react-router-dom"
import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';

import Home from "./screens/home/index";
import './index.css';

const theme = createTheme({
  primaryColor: 'green',
  defaultRadius: 'md',
});

const paths = [
  {
    path: '/',
    element : (
      <Home />
    ),
  }
]

const BrowserRouter = createBrowserRouter(paths);

const App = () => {
  return (
    <MantineProvider theme={theme}>
      <RouterProvider router={BrowserRouter}/>
    </MantineProvider>
  );
}

export default App;