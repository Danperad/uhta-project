import {createReducer, PayloadAction} from "@reduxjs/toolkit";
import {Device} from "../../models";
import {DeviceLoaded, DeviceNotLoaded} from "../actions/deviceAction";

const devices: Device[] = []

export const deviceReducer = createReducer(devices, (builder) => {
  builder.addCase(DeviceLoaded, (state, action: PayloadAction<Device[]>) => {
    return action.payload;
  }).addCase(DeviceNotLoaded, (state, action: PayloadAction<any>) => {
    return state;
  })
});
