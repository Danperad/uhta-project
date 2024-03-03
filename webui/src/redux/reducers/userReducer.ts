import {createReducer, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../../models";
import {UserLoaded, UserNotLoaded} from "../actions/userAction";

const users : User[] = []

export const userReducer = createReducer(users, (builder) => {
    builder.addCase(UserLoaded, (state, action: PayloadAction<User[]>) => {
        return action.payload;
    }).addCase(UserNotLoaded, (state, action: PayloadAction<any>) => {
        return state;
    })});