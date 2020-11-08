import { createAction, createReducer, configureStore } from "@reduxjs/toolkit";

export const addFocusable = createAction("ADD_LAYER");
export const initFocusable = createAction("INIT");

export const right = createAction("RIGHT");
export const left = createAction("LEFT");

const reduceAddFocusable = (state, action) => {
  const { depth, itemKey } = action.payload;
  const layer = state.layers[depth]
    ? new Set([...state.layers[depth], itemKey])
    : [itemKey];
  return { ...state, layers: { ...state.layers, [depth]: Array.from(layer) } };
};

const reduceInitFocusable = (state, action) => {
  return { ...state, activeItem: state.activeItem || action.payload };
};

const reduceRight = (state) => {
  // what is the next item?
  const depth = state.activeDepth;
  const i = state.activeItem;
  const layers = state.layers;

  // is there more items in this layer?
  const pos = layers[depth].indexOf(i) + 1;
  if (layers[depth].length > pos) {
    return { ...state, activeItem: layers[depth][pos] };
  }

  const nextDepth = depth + 1;
  return { ...state, activeItem: layers[nextDepth][0], activeDepth: nextDepth };
};

const reduceLeft = (state) => {
  // what is the next item?
  const depth = state.activeDepth;
  const i = state.activeItem;
  const layers = state.layers;

  // is there more items previously in this layer?
  const pos = layers[depth].indexOf(i);

  if (pos > 0) {
    return { ...state, activeItem: layers[depth][pos - 1] };
  }

  const nextDepth = depth - 1;

  if (nextDepth < 0) {
    return state;
  }

  return { ...state, activeItem: layers[nextDepth][0], activeDepth: nextDepth };
};

const focus = createReducer(
  { layers: {}, activeItem: "root", activeDepth: 0 },
  {
    [addFocusable]: reduceAddFocusable,
    [initFocusable]: reduceInitFocusable,
    [right]: reduceRight,
    [left]: reduceLeft,
  }
);

export const store = configureStore({
  reducer: focus,
});
