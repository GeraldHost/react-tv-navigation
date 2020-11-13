import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addFocusable } from "./focusStore";

const FocusContext = React.createContext({});
const useFocus = () => React.useContext(FocusContext);

const useWillMount = (fn) => {
  useMemo(() => fn(), []);
};

export const Focusable = ({ children, name, type = "row" }) => {
  const { parent } = useFocus();
  const dispatch = useDispatch();
  const activeNode = useSelector((state) => state.activeNode);

  useWillMount(() => {
    dispatch(addFocusable({ parent, name, type }));
  });

  const isActive = activeNode === name;

  return (
    <FocusContext.Provider value={{ parent: name }}>
      <div className={`focusable ${isActive && "active"}`}>{children}</div>
    </FocusContext.Provider>
  );
};

export const RootProvider = ({ children }) => (
  <FocusContext.Provider value={{ parent: null }}>
    <Focusable name="root">{children}</Focusable>
  </FocusContext.Provider>
);
