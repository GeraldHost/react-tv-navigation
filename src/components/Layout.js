import React from "react";

import "./layout.css";

export const Layout = ({ children }) => {
  return <div className="layout">{children}</div>;
};

export const Main = ({ children }) => {
  return <main className="main">{children}</main>;
};

export const Sidebar = ({ children }) => {
  return <div className="sidebar">{children}</div>;
};

Layout.Main = Main;
Layout.Sidebar = Sidebar;
