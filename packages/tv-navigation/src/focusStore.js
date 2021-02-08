import { createAction, createReducer } from "@reduxjs/toolkit";
import { addNode, createNode, nextNode, getNode } from "./tree";
import Shim from "./shim";

const TYPE_ROW = "row";
const TYPE_COL = "col";

export const removeFocusable = createAction("REMOVE_NODE");
export const addFocusable = createAction("ADD_NODE");

export const right = createAction("RIGHT");
export const left = createAction("LEFT");
export const down = createAction("DOWN");
export const up = createAction("UP");

export const focus = createAction("FOCUS");

export const reduceFocus = (state, action) => {
  const previousNode = state.activeNode;
  const name = action.payload;
  const node = getNode(state.tree, name);
  const activeNode = beforeFocus(node, previousNode);
  return { ...state, activeNode: activeNode, previousNode };
};

export const reduceAddFocusable = (state, action) => {
  const { parent, ...newNode } = action.payload;
  const newTree = addNode(state.tree, parent, newNode);
  return { ...state, tree: newTree };
};

export const reduceRemoveFocusable = (state, action) => {
  // TODO: implement
  return state;
};

const beforeFocus = (node, previousNode) => {
  // default behaviour for container nodes is for their first child
  // to recieve focus. We also take a refrence to the parent to pass it
  // into the shimmed functions
  while (node?.container && node.children[0]) {
    node = node.children[0];
  }

  // run all of the shims which will get passed the next node
  // and the previous node
  return Shim.run(node, previousNode, "beforeActive");
};

export const lrudHandler = (direction, type) => (state) => {
  const { tree, activeNode } = state;
  let maybeNext = nextNode(tree, activeNode.name, direction, type);
  if (!maybeNext?.name) {
    return { ...state };
  }
  const previousNode = activeNode;
  const next = beforeFocus(maybeNext, previousNode);
  return { ...state, activeNode: next, previousNode };
};

const rootNode = createNode(null, { name: "root", type: TYPE_ROW });
export const focusReducer = createReducer(
  {
    tree: rootNode,
    activeNode: rootNode,
    previousNode: null,
  },
  {
    [addFocusable]: reduceAddFocusable,
    [removeFocusable]: reduceRemoveFocusable,
    [right]: lrudHandler("forward", TYPE_COL),
    [left]: lrudHandler("backward", TYPE_COL),
    [up]: lrudHandler("backward", TYPE_ROW),
    [down]: lrudHandler("forward", TYPE_ROW),
    [focus]: reduceFocus,
  }
);
