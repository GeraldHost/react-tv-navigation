// TODO: convert to test focus.js now we have removed redux
// import {
//   removeFocusable,
//   addFocusable,
//   left,
//   right,
//   up,
//   down,
//   reduceAddFocusable,
//   reduceRemoveFocusable,
//   lrudHandler,
//   createNode,
// } from "./focusStore";

// describe("@actions", () => {
//   const actionWithPayload = (actionFn, type) => {
//     const payload = { payload: true };
//     const action = actionFn(payload);
//     expect(action).toStrictEqual({ type, payload: { payload: true } });
//   };

//   it("Add focusable", () => {
//     actionWithPayload(addFocusable, "ADD_NODE");
//   });

//   it("Remove focusable", () => {
//     actionWithPayload(removeFocusable, "REMOVE_NODE");
//   });

//   it("left", () => {
//     actionWithPayload(left, "LEFT");
//   });

//   it("right", () => {
//     actionWithPayload(right, "RIGHT");
//   });

//   it("up", () => {
//     actionWithPayload(up, "UP");
//   });

//   it("down", () => {
//     actionWithPayload(down, "DOWN");
//   });
// });

// describe("@reducers", () => {
//   const initialState = {
//     tree: createNode(null, { name: "root", type: "row" }),
//     activeNode: "root",
//   };

//   it("Add focusable", () => {
//     const node = { name: "new-node" };
//     const action = { type: "ADD_NODE", payload: createNode("root", node) };
//     const resp = reduceAddFocusable(initialState, action);
//     const expected = {
//       activeNode: "root",
//       tree: {
//         children: [
//           {
//             children: [],
//             name: "new-node",
//             parent: "root",
//           },
//         ],
//         name: "root",
//         parent: null,
//         type: "row",
//       },
//     };
//     expect(resp).toStrictEqual(expected);
//   });

//   it("LRUD reducer", () => {
//     const reducer = lrudHandler("forward", "col");
//     const tree = {
//       ...initialState.tree,
//       children: [createNode("root", { name: "node", type: "col" })],
//     };
//     const resp = reducer({ ...initialState, tree });
//     const expected = {
//       tree: {
//         name: "root",
//         type: "row",
//         parent: null,
//         children: [{ parent: "root", name: "node", type: "col", children: [] }],
//       },
//       activeNode: "node",
//     };
//     expect(resp).toMatchObject(expected);
//   });
// });

// describe("@helpers", () => {
//   it("Create node", () => {
//     const node = createNode("root", { name: "node", foo: "bar" });
//     const expected = {
//       children: [],
//       foo: "bar",
//       name: "node",
//       parent: "root",
//     };
//     expect(node).toStrictEqual(expected);
//   });

//   it("LRUD handler returns fn", () => {
//     const resp = lrudHandler("forward", "col");
//     expect(resp).toBeInstanceOf(Function);
//   });
// });
