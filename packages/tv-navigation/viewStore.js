import { createReducer } from "@reduxjs/toolkit";

export const addView = createAction("ADD_VIEW");
export const removeView = createAction("REMOVE_VIEW");

export const navigate = createAction("NAVIGATE_VIEW");
export const init = createAction("NAVIGATE_INIT");

const reduceAddView = (state, action) => {
  return state;
};

const reduceRemoveView = (state, action) => {
  return state;
};

const reduceNavigate = (state, action) => {
  return state;
};

export const viewReducer = createReducer(
  {
    active: false,
    views: [],
  },
  {
    [addView]: () => reduceAddView,
    [removeView]: () => reduceRemoveView,
    [navigate]: () => reduceNavigate,
  }
);
