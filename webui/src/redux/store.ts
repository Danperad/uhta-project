import {configureStore} from "@reduxjs/toolkit";
import {snackbarReducer} from "./reducers/snackbarReducer";

export const store = configureStore({
    reducer: {
        snackBar : snackbarReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch