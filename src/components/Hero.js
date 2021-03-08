import React from "react";
import cn from "classnames";
import { focusedCol } from "tv-navigation";

import "./hero.css";

export const Hero = focusedCol(({ active }) => {
  return (
    <div className={cn("hero", { "hero-active": active })}>
      <h1>React TV navigation</h1>
      <p>Use your arrow keys to navigate</p>
      <button className={cn("btn", { "btn-active": active })}>Select</button>
    </div>
  );
});
