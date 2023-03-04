import React from 'react';
import ReactDOM from 'react-dom';
import SignIn from './components/SignIn';
import SideBar from './components/SideBar';
import reportWebVitals from './reportWebVitals';
import {Stack} from "@mui/material";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export const outerTheme = createTheme({
  palette: {
    primary: {
      main: '#123456',
    },
    secondary: {
      main: '#C2C2C2',
    },
    success: {
      main: '#FFFFFF'
    }
  },
  typography: {
    fontFamily: ['"Roboto"'].join(','),
    "fontWeightMedium": 500,
    "fontWeightLight": 500,
    "fontWeightRegular": 500,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-display: swap;
          font-weight: 500;
          src: local('Roboto'), local('Roboto-Regular');
          unicodeRang": U+0030-0039;
          }
      `,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
      <ThemeProvider theme={outerTheme}>
        <BrowserRouter>
        <Stack direction="row" spacing={3} height="100%">
          <SideBar />
          <Routes>
            <Route path={"/"} element={<SignIn />} />
          </Routes>
          </Stack>
        </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
