import React from "react";
import cn from "classnames";
import { useActive, focusedCol, focusedRow } from "tv-navigation";

import "./layout.css";

export const Layout = ({ children }) => {
  const active = useActive("nav", false);
  return (
    <div className={cn("layout", { "sidebar-open": active })}>{children}</div>
  );
};

export const Main = focusedCol(({ children }) => {
  return <main className="main">{children}</main>;
});

export const Sidebar = ({ children }) => {
  return <div className="sidebar">{children}</div>;
};

export const Row = focusedRow((props) => <div {...props} />);

Layout.Main = Main;
Layout.Sidebar = Sidebar;
Layout.Row = Row;
