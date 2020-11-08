import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addFocusable, initFocusable } from "./focusStore";

const FocusContext = React.createContext({});
const useFocus = () => React.useContext(FocusContext);

export const Focusable = ({ children, itemKey }) => {
  const { depth } = useFocus();
  const dispatch = useDispatch();
  const activeItem = useSelector((state) => state.activeItem);

  useEffect(() => {
    dispatch(addFocusable({ depth, itemKey }));
  }, [itemKey, depth, dispatch, addFocusable]);

  const isActive = activeItem === itemKey;

  return (
    <FocusContext.Provider
      value={{
        depth: depth + 1,
      }}
    >
      <div className={`focusable ${isActive && "active"}`}>{children}</div>
    </FocusContext.Provider>
  );
};

export const RootProvider = ({ children }) => {
  const firstActiveIndex = 0;
  return (
    <FocusContext.Provider
      value={{
        depth: 0,
        active: firstActiveIndex,
      }}
    >
      {children}
    </FocusContext.Provider>
  );
};
