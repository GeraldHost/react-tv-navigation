import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import { right, left, store } from "./focusStore";
import { RootProvider, Focusable } from "./Focusable";

import "./App.css";

function Debug() {
  const state = useSelector((s) => s);
  const dispatch = useDispatch();

  const handleRight = () => {
    dispatch(right());
  };

  const handleLeft = () => {
    dispatch(left());
  };


  return (
    <>
      <pre>{false && JSON.stringify(state, null, 2)}</pre>
      <button onClick={handleLeft}>left</button>
      <button onClick={handleRight}>right</button>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <RootProvider>
        <Focusable itemKey="node-a">
        </Focusable>
        <Focusable itemKey="node-a-a">
        </Focusable>
      </RootProvider>
      <Debug />
    </Provider>
  );
}

export default App;
