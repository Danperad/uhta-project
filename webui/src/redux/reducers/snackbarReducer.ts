import {createReducer, PayloadAction} from "@reduxjs/toolkit";
import {Snackbar} from "../../models";
import {AddSnackbar, RemoveSnackbar} from "../actions/snackbarAction";

const snackbars: Snackbar[] = [];

export const snackbarReducer = createReducer(snackbars, (builder) => {
    builder.addCase(AddSnackbar, (state, action: PayloadAction<Snackbar>) => {
        const newSnackbars: Snackbar[] = [];
        state.forEach((item) => newSnackbars.push(item));
        newSnackbars.push(action.payload);
        return newSnackbars;
    }).addCase(RemoveSnackbar, (state, action: PayloadAction<Snackbar>) => {
        const newSnackbars: Snackbar[] = [];
        state.forEach((item) => {
            if(item.key !== action.payload.key)
                newSnackbars.push(item)
        });
        return newSnackbars;
    })
});