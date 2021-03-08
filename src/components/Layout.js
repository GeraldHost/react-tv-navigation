import React from "react";
import cn from "classnames";
import { useActive } from "tv-navigation";

import "./layout.css";

export const Layout = ({ children }) => {
const active = useActive("nav", false);
  return <div className={cn("layout", {"sidebar-open": active})}>{children}</div>;
};

export const Main = ({ children }) => {
  return <main className="main">{children}</main>;
};

export const Sidebar = ({ children }) => {
  return <div className="sidebar">{children}</div>;
};

Layout.Main = Main;
Layout.Sidebar = Sidebar;
