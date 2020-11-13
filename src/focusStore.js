import { createAction, createReducer, configureStore } from "@reduxjs/toolkit";

const TYPE_ROW = "row";
const TYPE_COL = "col";

export const addFocusable = createAction("ADD_LAYER");
export const initFocusable = createAction("INIT");

export const right = createAction("RIGHT");
export const left = createAction("LEFT");

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

const search = (tree, callback) => {
  if (callback(tree)) {
    return tree;
  }
  return tree.children.find((node) => search(node, callback));
};

/**
 * Get the next node in the tree
 * @param current {String} name of the current node
 * @param direction {forward|backward} direction
 */
const traverseTree = (tree, current, direction) => {
  if (
    direction === "forward" &&
    tree.parent === null &&
    tree.name === current
  ) {
    return tree.children[0];
  }

  const search = (node) => {
    const currentIndex = node.children.findIndex(
      (child) => child.name === current
    );
    const nextSiblingIncrement = direction === "forward" ? 1 : -1;
    const nextSibling =
      !!~currentIndex && node.children[currentIndex + nextSiblingIncrement];
    if (nextSibling) {
      return nextSibling;
    } else if (!!~currentIndex) {
      if (direction === "forward") {
        return node.children[currentIndex].children[0];
      } else {
        return node;
      }
    } else {
      return node.children.reduce((_, node) => search(node), null);
    }
  };
  return search(tree);
};

const nextNode = (tree, current) => traverseTree(tree, current, "forward");

const prevNode = (tree, current) => traverseTree(tree, current, "backward");

const reduceAddFocusable = (state, action) => {
  const { parent, name, type } = action.payload;
  const newTree = addNode(state.tree, parent, { name, type });
  return { ...state, tree: newTree };
};

const reduceInitFocusable = (state, action) => {
  return { ...state, activeNode: state.activeNode || action.payload };
};

const reduceRight = (state) => {
  const next = nextNode(state.tree, state.activeNode);
  return { ...state, activeNode: next.name };
};

const reduceLeft = (state) => {
  const next = prevNode(state.tree, state.activeNode);
  return { ...state, activeNode: next.name };
};

const focus = createReducer(
  {
    tree: createNode(null, { name: "root", type: TYPE_ROW }),
    activeNode: "root",
  },
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
