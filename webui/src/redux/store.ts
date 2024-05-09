import {configureStore} from "@reduxjs/toolkit";
import {snackbarReducer} from "./reducers/snackbarReducer";
import {deviceReducer} from "./reducers/deviceReducer";
import {consumableReducer} from "./reducers/consumableReducer";
import {userReducer} from "./reducers/userReducer";
import {currentUserReducer} from "./reducers/currentUserReducer";

export const store = configureStore({
  reducer: {
    snackBar: snackbarReducer,
    devices: deviceReducer,
    consumables: consumableReducer,
    users: userReducer,
    currentUser: currentUserReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
