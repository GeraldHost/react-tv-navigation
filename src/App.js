import React from "react";
import { Nav, Rail, Layout } from "./components";
import { RootFocusRow } from "tv-navigation";

import "./App.css";

function App() {
  return (
    <Layout>
      <RootFocusRow className="root-container" initialFocusNode="nav">
        <Layout.Sidebar>
          <Nav name="nav" container>
            <Nav.Item name="nav-item-a" icon="H">Home</Nav.Item>
            <Nav.Item name="nav-item-b" icon="C">Channels</Nav.Item>
            <Nav.Item name="nav-item-c" icon="S">Settings</Nav.Item>
          </Nav>
        </Layout.Sidebar>
        <Layout.Main>
          <Rail name="node" container tileWidth={20} railHeight={15} gutter={1}>
            <Rail.Row name="node-a" container className="row-container">
              <Rail.Tile name="node-a-1" />
              <Rail.Tile name="node-a-2" />
              <Rail.Tile name="node-a-3" />
              <Rail.Tile name="node-a-4" />
              <Rail.Tile name="node-a-5" />
              <Rail.Tile name="node-a-6" />
            </Rail.Row>
            <Rail.Row name="node-b" container className="row-container">
              <Rail.Tile name="node-b-1" />
              <Rail.Tile name="node-b-2" />
              <Rail.Tile name="node-b-3" />
              <Rail.Tile name="node-b-4" />
            </Rail.Row>
          </Rail>
        </Layout.Main>
      </RootFocusRow>
    </Layout>
  );
}

export default App;
