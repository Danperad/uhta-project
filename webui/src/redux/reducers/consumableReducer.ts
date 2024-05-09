import {createReducer, PayloadAction} from "@reduxjs/toolkit";
import {Consumable} from "../../models";
import {ConsumableLoaded, ConsumableNotLoaded} from "../actions/consumableAction";

const consumables: Consumable[] = []

export const consumableReducer = createReducer(consumables, (builder) => {
  builder.addCase(ConsumableLoaded, (state, action: PayloadAction<Consumable[]>) => {
    return action.payload;
  }).addCase(ConsumableNotLoaded, (state, action: PayloadAction<any>) => {
    return state;
  })
});
