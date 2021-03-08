import React from "react";
import cn from "classnames";
import {
  focusedCol,
  focusedRow,
} from "tv-navigation";

import "./nav.css";

export const Nav = focusedCol(({ className, ...props }) => {
  return <div className={cn(className, "nav")} {...props} />;
});

const NavItem = focusedRow(({ className, active, ...props }) => {
  return <div className={cn(className, { active }, "nav-item")} {...props} />;
});

Nav.Item = NavItem;
