import React from "react";
import { focusedCol, useTrackImediateChild } from "tv-navigation";

import "./hero.css";

export const Hero = focusedCol(({ active }) => {
  return (
    <div className="hero">
      <h1>React TV navigation</h1>
      <button>{active && "active:"} Select</button>
    </div>
  );
});
