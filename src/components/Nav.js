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

const NavItem = focusedRow(({ className, icon, active, children, ...props }) => {
  return (
  	<div className={cn(className, { active }, "nav-item")} {...props}>
  		<span className="nav-item-icon">{icon}</span> {children}
  	</div>
  );
});

Nav.Item = NavItem;
