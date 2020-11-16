import React from "react";
import { Provider } from "react-redux";

import { store } from "./focusStore";
import { Col, Row } from "./components";
import { RootFocusRow, focusedCol, focusedRow } from "./Focusable";

import "./App.css";

const FocusableItem = focusedCol(Col);
const FocusableRow = focusedRow(Row);
const FocusableCol = focusedCol((props) => <div {...props} />);

function App() {
  return (
    <Provider store={store}>
      <RootFocusRow initialFocusNode="node-a-1">
        <FocusableCol name="node" container>

          <FocusableRow name="node-a" container>
            <FocusableItem name="node-a-1" />
            <FocusableItem name="node-a-2" />
            <FocusableItem name="node-a-3" />
            <FocusableItem name="node-a-4" />
          </FocusableRow>

          <FocusableRow name="node-b" container>
            <FocusableItem name="node-b-1" />
            <FocusableItem name="node-b-2" />
            <FocusableItem name="node-b-3" />
            <FocusableItem name="node-b-4" />
          </FocusableRow>

        </FocusableCol>
      </RootFocusRow>
    </Provider>
  );
}

export default App;
