import {createAction} from "@reduxjs/toolkit";
import {Consumable} from "../../models";

export const ConsumableLoaded = createAction<Consumable[]>("CONSUMABLE_LOADED");
export const ConsumableNotLoaded = createAction("CONSUMABLE_NOT_LOADED");