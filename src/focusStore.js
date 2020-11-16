import { createAction, createReducer, configureStore } from "@reduxjs/toolkit";
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

export const createNode = (parent, node) => ({
  ...node,
  parent,
  children: [],
});

const walk = (tree, target, callback) => {
  if (tree.name === target) {
    return callback(tree);
  }

  const children = tree.children.map((node) => {
    if (node.name === target) {
      return callback(node);
    }
    return walk(node, target, callback);
  });
  return { ...tree, children };
};

const addNode = (tree, parent, newNode) => {
  const callback = (node) => {
    const children = [...node.children, createNode(parent, newNode)];
    return { ...node, children };
  };
  return walk(tree, parent, callback);
};

/**
 * Get the next node in the tree
 * @param current {String} name of the current node
 * @param direction {forward|backward} direction
 * TODO: slice the tree when we get a new active item so we have the full tree
 * but then possibly a smaller active tree. At the moment we have to walk the
 * whole tree to find out the next node
 * TODO: convert this recursion for while loop. It will be more performant
 */
const traverseTree = (tree, current, direction, type) => {
  const search = (node) => {
    if (
      (type === "col" && node.type === "row" && node.children.length <= 0) ||
      (type === "row" && node.type === "col" && node.children.length <= 0)
    ) {
      // The current node type does not match the provided type
      // we need to walk back up to the parent an perform the move from there
      // TODO: rather than traverse the whole tree again is it possible to implement
      // traverseSlice?
      return traverseTree(tree, node.parent, direction, type);
    }

    if (
      direction === "forward" &&
      node.name === current &&
      node.children[0] &&
      node.children[0].type === type
    ) {
      return node.children[0];
    }

    const currentIndex = node.children.findIndex(
      (child) => child.name === current && child.type === type
    );

    if (!node.children[currentIndex]) {
      // if we can't find the current node in the children keep walking down
      return node.children.reduce((acc, node) => acc || search(node), false);
    }

    // If there is valid sibling then return that node otherwise continue to
    // walk down the children until we find the next node that is the same type
    const nextSibling =
      node.children[currentIndex + (direction === "forward" ? 1 : -1)];
    if (nextSibling && nextSibling.type === type) {
      return nextSibling;
    } else {
      return node.children[currentIndex].children.find((c) => c.type === type);
    }
  };
  return search(tree);
};

export const reduceFocus = (state, action) => {
  return { ...state, activeNode: action.payload };
}

export const reduceAddFocusable = (state, action) => {
  const { parent, ...newNode } = action.payload;
  const newTree = addNode(state.tree, parent, newNode);
  return { ...state, tree: newTree };
};

export const reduceRemoveFocusable = (state, action) => {
  // TODO: implement
  return state;
};

export const lrudHandler = (direction, type) => (state) => {
  const { tree, activeNode } = state;
  let maybeNext = traverseTree(tree, activeNode, direction, type);
  if (!maybeNext?.name) {
    return { ...state };
  }
  
  // default behaviour for container nodes is for their first child 
  // to recieve focus. We also take a refrence to the parent to pass it
  // into the shimmed functions
  let parent;
  while(maybeNext?.container) {
    parent = maybeNext;
    maybeNext = maybeNext.children[0];
  }

  // run all of the shims which will get passed the maybe next node
  // and if we are dealing with container nodes the parent will also
  // get passed in
  const next = Shim.run(maybeNext, "beforeActive", parent);
  return { ...state, activeNode: next.name };
};

const focusReducer = createReducer(
  {
    tree: createNode(null, { name: "root", type: TYPE_ROW }),
    activeNode: "root",
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

export const store = configureStore({
  reducer: focusReducer,
});
