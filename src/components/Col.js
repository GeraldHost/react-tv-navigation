import React from "react";
import cn from "classnames";
import { useBeforeActive } from "../Focusable";

export const Col = ({ className, active, type, children, name, ...props }) => {
  const beforeActive = useBeforeActive(name);
  beforeActive((n) => n);

  return (
    <div className={cn(className, "item", { active, type })} {...props}>
      {children}
    </div>
  );
};
