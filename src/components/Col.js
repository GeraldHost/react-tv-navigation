import React from "react";
import cn from "classnames";

export const Col = ({ className, active, type, children, name, ...props }) => {
  return (
    <div className={cn(className, "item", { active, type })} {...props}>
      {children}
    </div>
  );
};
