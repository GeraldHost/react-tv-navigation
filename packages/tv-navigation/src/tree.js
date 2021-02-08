export const createNode = (parent, node) => ({
  ...node,
  parent,
  children: [],
});

export const walk = (tree, target, callback) => {
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

export const addNode = (tree, parent, newNode) => {
  const callback = (node) => {
    const children = [
      ...node.children,
      { index: node.children.length, ...createNode(parent, newNode) },
    ];
    return { ...node, children };
  };
  return walk(tree, parent, callback);
};

export const getNode = (tree, name) => {
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

export const getNextNode = (direction, type) => (node) => {
  const isForward = direction === "forward";
  const currentIndex = node.parent.children.findIndex(
    (c) => c.name === node.name && c.type === type
  );

  const nextSiblingIndex = currentIndex + (isForward ? 1 : -1);

  if (!~currentIndex || !~nextSiblingIndex) {
    const stack = [node.parent];
    let target = false;
    while (stack.length > 0) {
      const node = stack.pop();
      if (!node.container) {
        target = node.down;
      } else if (node.parent) {
        stack.push({ ...node.parent, down: node });
      }
    }
    return target && getNextNode(direction, type)(target);
  }

  return node.parent.children[nextSiblingIndex];
};

/**
 * Get the next node in the tree
 * @param name {String} name of the current node
 * @param direction {forward|backward} direction
 * TODO: slice the tree when we get a new active item so we have the full tree
 * but then possibly a smaller active tree. At the moment we have to walk the
 * whole tree to find out the next node
 */
export const nextNode = (tree, name, direction, type) => {
  const currentNode = getNode(tree, name);
  const getNextNodeFn = getNextNode(direction, type);

  if (type !== currentNode.type) {
    return getNextNodeFn(currentNode.parent) || currentNode;
  }

  const node = getNextNodeFn(currentNode);
  return node;
};
