import { addNode, createNode, nextNode, getNode } from "./tree";
import Shim from "./shim";

const TYPE_ROW = "row";
const TYPE_COL = "col";

const rootNode = createNode(null, { name: "root", type: TYPE_ROW });
const initialState = {
    tree: rootNode,
    activeNode: rootNode,
    previousNode: null,
}

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

function createFocus() {
	let state = initialState;
	let listeners = [];
	const helpers = { getNode };

	const updateState = (newState) => {
		state = { ...newState }
		for (let i = 0; i < listeners.length; i++) {
			listeners[i](state, helpers)
		}
	}

	const focus = (name) => {
	  const previousNode = state.activeNode;
	  const node = getNode(state.tree, name);
	  const activeNode = beforeFocus(node, previousNode);
	  updateState({ ...state, activeNode: activeNode, previousNode });
	};

	const focusChild = (n) => {
		const activeNode = state.activeNode;
		if(!activeNode.parent) {
			// there is no parent so there will be no siblings
			return
		}

		const parentNode = getNode(state.tree, activeNode.parent);
		const childNode = parentNode.children[n]
		if(!childNode) {
			// this child node doesn't exist
			return
		}
		focus(children.name)
	}

	const addFocusable = (node) => {
	  const { parent, ...newNode } = node;
	  const newTree = addNode(state.tree, parent, newNode);
	  updateState({ ...state, tree: newTree });
	};

	const removeFocusable = (action) => {
	  // TODO: implement
	  return state;
	};

	const lrudHandler = (direction, type) => () => {
	  const { tree, activeNode } = state;
	  let maybeNext = nextNode(tree, activeNode.name, direction, type);
	  if (!maybeNext?.name) {
	    return { ...state };
	  }
	  const previousNode = activeNode;
	  const next = beforeFocus(maybeNext, previousNode);
	  updateState({ ...state, activeNode: next, previousNode });
	};

	const subscribe = (listener) => {
		if(typeof listener !== "function") {
			throw Error("Invalid listener type. Listeners must be functions.")
		}
		listeners.push(listener)
	}

	return { 
		focus, 
		addFocusable, 
		removeFocusable, 
		subscribe,
		focusChild,
		right: lrudHandler("forward", TYPE_COL),
		left: lrudHandler("backward", TYPE_COL),
		up: lrudHandler("backward", TYPE_ROW),
		down: lrudHandler("forward", TYPE_ROW),
	}
}

export const focus = createFocus();
