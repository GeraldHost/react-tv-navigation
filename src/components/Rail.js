import React, { createContext, useContext } from "react";
import cn from "classnames";
import { focusedCol, focusedRow, useTrackImediateChild } from "tv-navigation";

import "./rail.css";

/**
 * Example:
 * <Rail gutter={20} cols={5} rows={4} /> // this would produce grid with 5 cols and 4 rows
 *
 * const { gutter, colWidth, colHeight } = useRail()
 *
 * const verticalOffset = childIndex*colHeight+(2*gutter)
 * const horizantalOffset = childIndex*colWidth+(2*gutter)
 */

const vw = (str) => `${str}vw`;
const percentage = (str) => `${str}%`;

const RailContext = createContext({});
const useRail = () => useContext(RailContext);

export const Rail = focusedCol(
  ({ tileWidth, railHeight, gutter, children, className, ...props }) => {
    const { childIndex } = useTrackImediateChild(props.name);
    const verticalOffset = childIndex * (railHeight + 2 * gutter);

    return (
      <div className="rail-wrapper">
        <div
          className={cn("rail", className)}
          {...props}
          style={{ transform: `translateY(-${vw(verticalOffset)})` }}
        >
          <RailContext.Provider
            value={{
              gutter,
              tileWidth,
              railHeight,
              tileCount: children.length,
            }}
          >
            {children}
          </RailContext.Provider>
        </div>
      </div>
    );
  }
);

const RailRow = focusedRow(({ active, className, ...props }) => {
  const { childIndex } = useTrackImediateChild(props.name);
  const { tileWidth } = useRail();

  const tileCount = props.children.length;
  const maxOffset = tileWidth * tileCount - 100;
  let horizantalPercentageOffset = childIndex * tileWidth;
  if (horizantalPercentageOffset > maxOffset) {
    horizantalPercentageOffset = maxOffset;
  }

  if (process.env.NODE_ENV === "development") {
    for (let i = 0; i < props.children.length; i++) {
      if (props.children[i].type.displayName !== "rail-tile") {
        throw new Error(
          "Children of rail rows must be rail tiles <Rail.Tile />"
        );
      }
    }
  }

  return (
    <div
      className={cn("rail-row", className)}
      {...props}
      style={{
        transform: `translateX(calc(-${percentage(
          horizantalPercentageOffset
        )}))`,
      }}
    />
  );
});

const RailTile = focusedCol(({ active, className, ...props }) => {
  const { gutter, tileWidth, railHeight } = useRail();

  return (
    <div
      className={cn("rail-tile", className, { active })}
      {...props}
      style={{
        height: vw(railHeight),
        width: `calc(${percentage(tileWidth)} - ${vw(gutter * 2)})`,
        margin: vw(gutter),
      }}
    />
  );
});

RailRow.displayName = "rail-row";
RailTile.displayName = "rail-tile";

Rail.Row = RailRow;
Rail.Tile = RailTile;
