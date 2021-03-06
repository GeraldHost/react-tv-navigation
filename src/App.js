import React from "react";
import { Nav, Rail, Layout, Hero, Row, Col } from "./components";
import { RootFocusRow, focusedRow, focusedCol } from "tv-navigation";

import "./App.css";

function App() {
  return (
    <Layout>
      <RootFocusRow className="root-container" initialFocusNode="nav">
        <Layout.Sidebar>
          <Nav name="nav" container>
            <Nav.Item name="nav-item-a" icon="H">
              Home
            </Nav.Item>
            <Nav.Item name="nav-item-b" icon="C">
              Channels
            </Nav.Item>
            <Nav.Item name="nav-item-c" icon="S">
              Settings
            </Nav.Item>
          </Nav>
        </Layout.Sidebar>
        <Layout.Main name="main-focus" container>
          <Layout.Row name="layout-row-a" container>
            <Hero name="hero-item" />
          </Layout.Row>
          <Layout.Row name="layout-row-b" container>
            <Rail
              name="node"
              container
              tileWidth={20}
              railHeight={13}
              gutter={1}
            >
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
                <Rail.Tile name="node-b-5" />
                <Rail.Tile name="node-b-6" />
                <Rail.Tile name="node-b-7" />
              </Rail.Row>
              <Rail.Row name="node-c" container className="row-container">
                <Rail.Tile name="node-c-1" />
                <Rail.Tile name="node-c-2" />
                <Rail.Tile name="node-c-3" />
                <Rail.Tile name="node-c-4" />
                <Rail.Tile name="node-c-5" />
                <Rail.Tile name="node-c-6" />
                <Rail.Tile name="node-c-7" />
              </Rail.Row>
              <Rail.Row name="node-d" container className="row-container">
                <Rail.Tile name="node-d-1" />
                <Rail.Tile name="node-d-2" />
                <Rail.Tile name="node-d-3" />
                <Rail.Tile name="node-d-4" />
                <Rail.Tile name="node-d-5" />
                <Rail.Tile name="node-d-6" />
                <Rail.Tile name="node-d-7" />
              </Rail.Row>
            </Rail>
          </Layout.Row>
        </Layout.Main>
      </RootFocusRow>
    </Layout>
  );
}

export default App;
