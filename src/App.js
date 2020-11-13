import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import { right, left, store, down, up } from "./focusStore";
import { RootProvider, Focusable } from "./Focusable";

import "./App.css";

function Debug() {
  //const state = useSelector((s) => s);
  const dispatch = useDispatch();

  const handleRight = () => void dispatch(right());
  const handleLeft = () => void dispatch(left());
  const handleDown = () => void dispatch(down());
  const handleUp = () => void dispatch(up());

  // <pre>{JSON.stringify(state, null, 2)}</pre>
  return (
    <>
      <button onClick={handleLeft}>left</button>
      <button onClick={handleRight}>right</button>
      <button onClick={handleDown}>down</button>
      <button onClick={handleUp}>up</button>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <RootProvider>
        <Focusable name="node-a" type="col">
          <Focusable name="node-a-1" type="row"></Focusable>
          <Focusable name="node-a-2" type="row"></Focusable>
        </Focusable>
        <Focusable name="node-b-1" type="col"></Focusable>
      </RootProvider>
      <Debug />
    </Provider>
  );
}

export default App;
