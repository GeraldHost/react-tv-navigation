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
  // if there is no parent that means we are at the root node and there is no
  // where for use to go. so we just return and the active focus node does not change
  if (!node.parent) {
    return;
  }

  const isForward = direction === "forward";
  const currentIndex = node.parent.children.findIndex(
    (c) => c.name === node.name && c.type === type
  );

  const nextSiblingIndex = currentIndex + (isForward ? 1 : -1);

  if(!~currentIndex) {
    // there is no current Index. this means the node provided does not exist
    // as a child of it's "parent". This means something has gone wrong so we just
    // return the current Node
    return node;
  }

  if (!node.parent.children[nextSiblingIndex]) {
    // there is no "next" sibling node so we need to go up the the parent and
    // perform the move from there

    // push the parent node onto the stack
    const stack = [node.parent];
    let target = false;
    while (stack.length > 0) {
      const searchNode = stack.pop();

      const isContainer = searchNode.container;
      const isOnlyChild = searchNode.parent?.children.length <= 1

      if(isContainer && isOnlyChild) {
        // if the node is a container and it has no siblings then we 
        // need to go up another parent level and perform the move from there
        stack.push(searchNode.parent);
      } else {
        // return the first child
        if(searchNode.type !== type) {
          stack.push(searchNode.parent);
        } else {
          const searchNodeIdx = searchNode.parent?.children.findIndex(node => node.name === searchNode.name);
          const searchNodeSibling = searchNode.parent.children[searchNodeIdx+(isForward ? 1 : -1)];
          if(searchNodeSibling){
            return searchNodeSibling;
          } else {
            stack.push(searchNode.parent);
          }
        }
      }
    }
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
    // if the current node type and the move type are different then go up to the parent
    // and perform the move from there. If there is no parent then return current node
    if(!currentNode.parent) {
      // nothing we can do so return current node
      return currentNode;
    }
    // perform move from current node parent
    return getNextNodeFn(currentNode.parent) || currentNode;
  }

  const node = getNextNodeFn(currentNode);
  return node;
};
