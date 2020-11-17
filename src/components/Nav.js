import React from "react";
import cn from "classnames";

export const Nav = ({ className, ...props }) => {
  return <div className={cn(className, "nav")} {...props} />;
};

const NavItem = ({ className, active, ...props }) => {
  return <div className={cn(className, { active }, "nav-item")} {...props} />;
};

Nav.Item = NavItem;
