import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { focusReducer } from "./focusStore";

const rootReducer = combineReducers({
  focus: focusReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
