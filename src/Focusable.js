import React, { useMemo } from "react";
import { connect, useDispatch } from "react-redux";

import { addFocusable } from "./focusStore";

const FocusContext = React.createContext({});
const useFocus = () => React.useContext(FocusContext);

const useWillMount = (fn) => {
  useMemo(() => fn(), []);
};

export const Focusable = connect((state, props) => ({
  ...props,
  isActive: state.activeNode === props.name,
}))(({ isActive, children, name, type = "row" }) => {
  const { parent } = useFocus();
  const dispatch = useDispatch();

  useWillMount(() => {
    dispatch(addFocusable({ parent, name, type }));
  });

  return (
    <FocusContext.Provider value={{ parent: name }}>
      <div className={`focusable ${isActive && "active"} ${type}`}>
        {children}
      </div>
    </FocusContext.Provider>
  );
});

export const RootProvider = ({ children }) => (
  <FocusContext.Provider value={{ parent: null }}>
    <Focusable name="root" type="row">
      {children}
    </Focusable>
  </FocusContext.Provider>
);
