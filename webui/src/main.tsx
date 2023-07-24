import React from 'react';
import {createRoot} from 'react-dom/client';
import SideBar from './components/SideBar';
import DeviceAndConsumable from './components/DeviceAndConsumable';
import ApplicationPage from './components/ApplicationPage';
import reportWebVitals from './reportWebVitals';
import {Stack} from "@mui/material";
import {SnackbarProvider} from "notistack";

import {createTheme, ThemeProvider} from '@mui/material/styles';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SnackbarViewer from "./components/SnackbarViewer";
import {Provider} from "react-redux";
import {store} from "./redux/store";

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
        MuiFormLabel: {
            styleOverrides: {
                asterisk: {
                    color: "#db3131",
                    "&$error": {
                        color: "#db3131",
                    },
                },
            },
        },
    },

});
const domNode = document.getElementById("root");
if (domNode !== null) {
    const root = createRoot(domNode);
    root.render(
        <React.StrictMode>
            <Provider store={store}>
                <ThemeProvider theme={outerTheme}>
                    <SnackbarProvider maxSnack={2} anchorOrigin={{vertical: "top", horizontal: "right"}}>
                        <BrowserRouter>
                            <Stack direction="row" spacing={1} height="100vh">
                                <SideBar/>
                                <Routes>
                                    <Route path={"device"} element={<DeviceAndConsumable/>}/>
                                    <Route path={"order"} element={<ApplicationPage/>}/>
                                </Routes>
                                <SnackbarViewer/>
                            </Stack>
                        </BrowserRouter>
                    </SnackbarProvider>
                </ThemeProvider>
            </Provider>
        </React.StrictMode>,
    );
}
reportWebVitals();
