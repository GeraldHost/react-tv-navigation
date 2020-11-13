import { createAction, createReducer, configureStore } from "@reduxjs/toolkit";

export const addFocusable = createAction("ADD_LAYER");
export const initFocusable = createAction("INIT");

export const right = createAction("RIGHT");
export const left = createAction("LEFT");

const createNode = (parent, name) => ({
  name,
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

const addNode = (tree, parent, nodeName) => {
  const callback = (node) => {
    const children = [...node.children, createNode(parent, nodeName)];
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

const nextNode = (tree, current) => {
  if (tree.parent === null && tree.name === current) {
    // <- diff
    return tree.children[0]; // <- |
  } // <- |
  const search = (node) => {
    // do this recurrsively
    // find child index
    const currentIndex = node.children.findIndex(
      (child) => child.name === current
    );
    const nextSibling = !!~currentIndex && node.children[currentIndex + 1];
    if (nextSibling) {
      return nextSibling;
    } else if (!!~currentIndex) {
      return node.children[currentIndex].children[0];
    } else {
      return node.children.reduce((_, node) => search(node), null);
    }
  };
  return search(tree);
};

const prevNode = (tree, current) => {
  const search = (node) => {
    // do this recurrsively
    // find child index
    const currentIndex = node.children.findIndex(
      (child) => child.name === current
    );
    const prevSibling = !!~currentIndex && node.children[currentIndex - 1]; // <- diff
    if (prevSibling) {
      return prevSibling;
    } else if (!!~currentIndex) {
      return node; // <- diff
    } else {
      return node.children.reduce((_, node) => search(node), null);
    }
  };
  return search(tree);
};

const reduceAddFocusable = (state, action) => {
  const { parent, itemKey } = action.payload;
  const newTree = addNode(state.tree, parent, itemKey);
  return { ...state, tree: newTree };
};

const reduceInitFocusable = (state, action) => {
  return { ...state, activeItem: state.activeItem || action.payload };
};

const reduceRight = (state) => {
  const next = nextNode(state.tree, state.activeItem);
  return { ...state, activeItem: next.name };
};

const reduceLeft = (state) => {
  const next = prevNode(state.tree, state.activeItem);
  console.log("left", next.name);
  return { ...state, activeItem: next.name };
};

const focus = createReducer(
  { tree: createNode(null, "root"), activeItem: "root", activeDepth: 0 },
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
