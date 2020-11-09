import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addFocusable, initFocusable } from "./focusStore";

const FocusContext = React.createContext({});
const useFocus = () => React.useContext(FocusContext);

export const Focusable = ({ children, itemKey }) => {
  const { parent } = useFocus();
  const dispatch = useDispatch();
  const activeItem = useSelector((state) => state.activeItem);

  // TODO: this will break in concurrent mode?
  useMemo(() => {
    dispatch(addFocusable({ parent, itemKey }));
  }, [itemKey, parent, dispatch, addFocusable]);

  const isActive = activeItem === itemKey;

  return (
    <FocusContext.Provider value={{ parent: itemKey }}>
      {itemKey}
      <div className={`focusable ${isActive && "active"}`}>{children}</div>
    </FocusContext.Provider>
  );
};

export const RootProvider = ({ children }) => {
  const firstActiveIndex = 0;
  return (
    <FocusContext.Provider value={{ parent: "root" }}>
      {children}
    </FocusContext.Provider>
  );
};
