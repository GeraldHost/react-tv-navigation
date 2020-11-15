import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import { right, left, store, down, up } from "./focusStore";
import { RootProvider, withFocus } from "./Focusable";

import "./App.css";

function Debug() {
  const state = useSelector((s) => s);
  const dispatch = useDispatch();

  const handleRight = () => void dispatch(right());
  const handleLeft = () => void dispatch(left());
  const handleDown = () => void dispatch(down());
  const handleUp = () => void dispatch(up());

  return (
    <>
      <button onClick={handleLeft}>left</button>
      <button onClick={handleRight}>right</button>
      <button onClick={handleDown}>down</button>
      <button onClick={handleUp}>up</button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  );
}

const beforeActive = (node) =>
  node.children.length > 0 ? node.children[0] : node;

const Focusable = withFocus(({ active, type, ...props }) => (
  <div className={`focusable ${active && "active"} ${type}`} {...props} />
));

function App() {
  return (
    <Provider store={store}>
      <RootProvider>
        <Focusable name="node" beforeActive={beforeActive} type="col">
          <Focusable name="node-a" type="row" beforeActive={beforeActive}>
            <Focusable name="node-a-1" type="col" />
            <Focusable name="node-a-2" type="col" />
          </Focusable>
          <Focusable name="node-b" type="row"></Focusable>
        </Focusable>
      </RootProvider>
      <Debug />
    </Provider>
  );
}

export default App;
