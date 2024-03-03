import {createAction} from "@reduxjs/toolkit";
import {User} from "../../models";

export const UserLoaded = createAction<User[]>("USER_LOADED");
export const UserNotLoaded = createAction("USER_NOT_LOADED");