import {createAction} from "@reduxjs/toolkit";
import {User} from "../../models";

export const CurrentUserLoaded = createAction<User>("Current_USER_LOADED");
export const CurrentUserNotLoaded = createAction("Current_USER_NOT_LOADED");