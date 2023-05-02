import {configureStore} from "@reduxjs/toolkit";
import {snackbarReducer} from "./reducers/snackbarReducer";
import {deviceReducer} from "./reducers/deviceReducer";
import {consumableReducer} from "./reducers/consumableReducer";

export const store = configureStore({
    reducer: {
        snackBar : snackbarReducer,
        devices: deviceReducer,
        consumables: consumableReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch