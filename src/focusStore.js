import { createAction, createReducer, configureStore } from "@reduxjs/toolkit";

const TYPE_ROW = "row";
const TYPE_COL = "col";

export const addFocusable = createAction("ADD_LAYER");
export const initFocusable = createAction("INIT");

export const right = createAction("RIGHT");
export const left = createAction("LEFT");
export const down = createAction("DOWN");
export const up = createAction("UP");

const createNode = (parent, { name, type }) => ({
  name,
  type,
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

const addNode = (tree, parent, { name, type }) => {
  const callback = (node) => {
    const children = [...node.children, createNode(parent, { name, type })];
    return { ...node, children };
  };
  return walk(tree, parent, callback);
};

/**
 * Get the next node in the tree
 * @param current {String} name of the current node
 * @param direction {forward|backward} direction
 */
const traverseTree = (tree, current, direction, type) => {
  const search = (node) => {
    if (
      direction === "forward" &&
      node.name === current &&
      node.children[0].type === type
    ) {
      return node.children[0];
    }
    const currentIndex = node.children.findIndex(
      (child) => child.name === current && child.type === type
    );
    const nextSiblingIncrement = direction === "forward" ? 1 : -1;
    const nextSibling =
      !!~currentIndex && node.children[currentIndex + nextSiblingIncrement];
    if (nextSibling && nextSibling.type === type) {
      return nextSibling;
    } else if (!!~currentIndex) {
      return node.children[currentIndex].children.find((c) => c.type === type);
    } else {
      return node.children.reduce((_, node) => search(node), null);
    }
  };
  return search(tree);
};

const reduceAddFocusable = (state, action) => {
  const { parent, name, type } = action.payload;
  const newTree = addNode(state.tree, parent, { name, type });
  return { ...state, tree: newTree };
};

const lrudHandler = (direction, type) => (state) => {
  const { tree, activeNode } = state;
  const next = traverseTree(tree, activeNode, direction, type);
  if (!next?.name) {
    return { ...state };
  }
  return { ...state, activeNode: next.name };
};

const focus = createReducer(
  {
    tree: createNode(null, { name: "root", type: TYPE_ROW }),
    activeNode: "root",
  },
  {
    [addFocusable]: reduceAddFocusable,
    [right]: lrudHandler("forward", TYPE_COL),
    [left]: lrudHandler("backward", TYPE_COL),
    [up]: lrudHandler("backward", TYPE_ROW),
    [down]: lrudHandler("forward", TYPE_ROW),
  }
);

export const store = configureStore({
  reducer: focus,
});
