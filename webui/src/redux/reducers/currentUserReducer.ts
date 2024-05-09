import {createReducer, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../../models";
import {CurrentUserLoaded, CurrentUserNotLoaded} from "../actions/currentUserAction";

interface UserState {
  user: User | undefined
}

const state: UserState = {user: undefined}

export const currentUserReducer = createReducer(state, (builder) => {
  builder.addCase(CurrentUserLoaded, (_, action: PayloadAction<User>) => {
    return {user: action.payload};
  }).addCase(CurrentUserNotLoaded, (_, __: PayloadAction) => {
    return {user: undefined};
  })
});
