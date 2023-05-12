import {createAction} from "@reduxjs/toolkit";
import {Device} from "../../models";

export const DeviceLoaded = createAction<Device[]>("DEVICE_LOADED");
export const DeviceNotLoaded = createAction("DEVICE_NOT_LOADED");