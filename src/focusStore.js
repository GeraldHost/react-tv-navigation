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

const getNode = (tree, name) => {
  const stack = [tree];
  let currentNode = false;
  while (stack.length > 0 && !currentNode) {
    const node = stack.pop();
    if (node.name === name) {
      currentNode = node;
    }
    if (node.children) {
      for (const child of node.children) {
        stack.push({ ...child, parent: node });
      }
    }
  }
  return currentNode;
};

/**
 * Get the next node in the tree
 * @param name {String} name of the current node
 * @param direction {forward|backward} direction
 * TODO: slice the tree when we get a new active item so we have the full tree
 * but then possibly a smaller active tree. At the moment we have to walk the
 * whole tree to find out the next node
 */
const nextNode = (tree, name, direction, type) => {
  const isForward = direction === "forward";
  const currentNode = getNode(tree, name);

  const getNextNode = (node) => {
    const currentIndex = node.parent.children.findIndex(
      (c) => c.name === node.name
    );
    const nextSiblingIndex = currentIndex + (isForward ? 1 : -1);
    const next = node.parent.children[nextSiblingIndex];

    if (!next) {
      // handle going next
      debugger;
    }

    return next;
  };

  if (
    (type === "col" &&
      currentNode.type === "row" &&
      currentNode.children.length <= 0) ||
    (type === "row" &&
      currentNode.type === "col" &&
      currentNode.children.length <= 0)
  ) {
    return getNextNode(currentNode.parent);
  }

  return getNextNode(currentNode);
};

export const reduceFocus = (state, action) => {
  const name = action.payload;
  const node = getNode(state.tree, name);
  const activeNode = beforeFocus(node);
  return { ...state, activeNode: activeNode.name };
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

const beforeFocus = (node) => {
  // default behaviour for container nodes is for their first child
  // to recieve focus. We also take a refrence to the parent to pass it
  // into the shimmed functions
  while (node?.container && node.children[0]) {
    node = node.children[0];
  }

  // run all of the shims which will get passed the maybe next node
  // and if we are dealing with container nodes the parent will also
  // get passed in
  return Shim.run(node, "beforeActive");
};

export const lrudHandler = (direction, type) => (state) => {
  const { tree, activeNode } = state;
  let maybeNext = nextNode(tree, activeNode, direction, type);
  if (!maybeNext?.name) {
    return { ...state };
  }
  const next = beforeFocus(maybeNext);
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
