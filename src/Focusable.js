import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addFocusable } from "./focusStore";

const FocusContext = React.createContext({});
const useFocus = () => React.useContext(FocusContext);

const useWillMount = (fn) => {
  useMemo(() => fn(), []);
};

export const Focusable = ({ children, itemKey, type = "row" }) => {
  const { parent } = useFocus();
  const dispatch = useDispatch();
  const activeItem = useSelector((state) => state.activeItem);

  useWillMount(() => {
    dispatch(addFocusable({ parent, itemKey, type }));
  });

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
    <FocusContext.Provider value={{ parent: null }}>
      <Focusable itemKey="root">{children}</Focusable>
    </FocusContext.Provider>
  );
};
