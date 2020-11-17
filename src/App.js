import React from "react";
import { Provider } from "react-redux";

import { store } from "./focusStore";
import { Col, Row, Nav } from "./components";
import { RootFocusRow, focusedCol, focusedRow } from "./Focusable";

import "./App.css";

const FocusableItem = focusedCol(Col);
const FocusableRow = focusedRow(Row);
const FocusableCol = focusedCol((props) => <div {...props} />);

const FocusableNav = focusedCol(Nav);
const FocusableNavItem = focusedCol(Nav.Item);

function App() {
  return (
    <Provider store={store}>
      <RootFocusRow className="root-container" initialFocusNode="node-a">
        <FocusableNav name="nav" container>
          <FocusableNavItem name="nav-item-a" />
          <FocusableNavItem name="nav-item-b" />
          <FocusableNavItem name="nav-item-c" />
        </FocusableNav>

        <FocusableCol name="node" container>
          <FocusableRow name="node-a" className="row-container" container>
            <FocusableItem name="node-a-1" />
            <FocusableItem name="node-a-2" />
            <FocusableItem name="node-a-3" />
            <FocusableItem name="node-a-4" />
          </FocusableRow>

          <FocusableRow name="node-b" className="row-container" container>
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
