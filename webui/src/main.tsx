import React from 'react';
import {createRoot} from 'react-dom/client';
import SideBar from './components/SideBar';
import Device from './components/Device';
import Order from './components/Order';
import reportWebVitals from './reportWebVitals';
import {Stack} from "@mui/material";

import {createTheme, ThemeProvider} from '@mui/material/styles';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

export const outerTheme = createTheme({
    palette: {
        primary: {
            main: '#0D47A1',
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
        "fontSize": 16,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-display: swap;
          font-weight: 500;
          font-size: 30px;
          src: local('Roboto'), local('Roboto-Regular');
          unicodeRang": U+0030-0039;
          }
      `,
        },
    },
});
const domNode = document.getElementById("root");
if (domNode !== null) {
    const root = createRoot(domNode);
    root.render(
        <React.StrictMode>
            <ThemeProvider theme={outerTheme}>
                <BrowserRouter>
                    <Stack direction="row" spacing={3} height="100%">
                        <SideBar/>
                        <Routes>
                            <Route path={"device"} element={<Device/>}/>
                            <Route path={"order"} element={<Order/>}/>
                        </Routes>
                    </Stack>
                </BrowserRouter>
            </ThemeProvider>
        </React.StrictMode>,
    );
}
reportWebVitals();
