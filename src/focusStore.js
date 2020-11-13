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
 * TODO: slice the tree when we get a new active item so we have the full tree
 * but then possibly a smaller active tree. At the moment we have to walk the
 * whole tree to find out the next node
 */
const traverseTree = (tree, current, direction, type) => {
  const search = (node) => {
    if (
      direction === "forward" &&
      node.name === current &&
      node.children[0] &&
      node.children[0].type === type
    ) {
      return node.children[0];
    }

    if (type === "col" && node.type === "row" && node.children.length <= 0) {
      // The current node type does not match the provided type
      // we need to walk back up to the parent an perform the move from there
      return traverseTree(tree, node.parent, direction, type);
    }

    const currentIndex = node.children.findIndex(
      (child) => child.name === current && child.type === type
    );
    const currentNode = node.children[currentIndex];

    if (!currentNode) {
      // if we can't find the current node in the children keep walking down
      return node.children.reduce((acc, node) => acc || search(node), false);
    }

    // if (
    //   type === "col" &&
    //   currentNode.type === "row" &&
    //   (currentNode.children.length <= 0 ||
    //     currentIndex === 0 ||
    //     currentIndex === node.children.length - 1)
    // ) {
    //   // TODO:
    //   // The current node type does not match the provided type
    //   // we need to walk back up to the parent an perform the move from there
    //   return search(tree, currentNode.parent, direction, type);
    // }

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
