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
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <button onClick={handleLeft}>left</button>
      <button onClick={handleRight}>right</button>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <RootProvider>
        <Focusable itemKey="root">
          <Focusable itemKey="left"></Focusable>
          <Focusable itemKey="right">
            <Focusable itemKey="right-one"></Focusable>
            <Focusable itemKey="right-two">
              <Focusable itemKey="inner"></Focusable>
            </Focusable>
            <Focusable itemKey="right-three"></Focusable>
          </Focusable>
        </Focusable>
      </RootProvider>
      <Debug />
    </Provider>
  );
}

export default App;
