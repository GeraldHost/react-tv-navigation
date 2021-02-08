import React, { createContext, useContext, useEffect } from "react";

const ViewContext = createContext({});
const useView = () => useContext(ViewContext);

export function View({ children }) {
  return (
    <ViewContext.Provider value={}>
      <div className="tv-view">{children}</div>;
    </ViewContext.Provider>
  );
}
