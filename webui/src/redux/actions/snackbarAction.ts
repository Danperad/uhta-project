import {createAction} from "@reduxjs/toolkit";
import {Snackbar} from "../../models";

export const AddSnackbar = createAction<Snackbar>("ADD_SNACKBAR");
export const RemoveSnackbar = createAction<Snackbar>("REMOVE_SNACKBAR");