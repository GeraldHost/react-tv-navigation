import React from "react";
import { Nav, Rail } from "./components";
import { RootFocusRow } from "tv-navigation";

import "./App.css";

function App() {
  return (
    <RootFocusRow className="root-container" initialFocusNode="nav">
      <Nav name="nav" container>
        <Nav.Item name="nav-item-a" />
        <Nav.Item name="nav-item-b" />
        <Nav.Item name="nav-item-c" />
      </Nav>

      <Rail name="node" container tileWidth={10} railHeight={10} gutter={1}>
        <Rail.Row name="node-a" container className="row-container">
          <Rail.Tile name="node-a-1" />
          <Rail.Tile name="node-a-2" />
          <Rail.Tile name="node-a-3" />
          <Rail.Tile name="node-a-4" />
        </Rail.Row>

        <Rail.Row name="node-b" container className="row-container">
          <Rail.Tile name="node-b-1" />
          <Rail.Tile name="node-b-2" />
          <Rail.Tile name="node-b-3" />
          <Rail.Tile name="node-b-4" />
        </Rail.Row>
      </Rail>
    </RootFocusRow>
  );
}

export default App;
