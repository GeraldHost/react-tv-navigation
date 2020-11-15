import React, { useMemo, useEffect } from "react";
import { connect, useDispatch } from "react-redux";

import { addFocusable, removeFocusable } from "./focusStore";
import Shim from "./shim";

const FocusContext = React.createContext({});
const useFocus = () => React.useContext(FocusContext);

const useWillMount = (fn) => {
  useMemo(() => fn(), []);
};

const useUnmount = (fn) => {
  useEffect(() => {
    return () => fn();
  }, []);
};

const mapStateToProps = (state, props) => ({
  ...props,
  active: state.activeNode === props.name,
});

export const withFocus = (Component) => {
  return connect(mapStateToProps)(
    ({ active, name, type = "row", beforeActive, ...props }) => {
      const { parent } = useFocus();
      const dispatch = useDispatch();

      useWillMount(() => {
        Shim.register(name, "beforeActive", beforeActive);
        dispatch(addFocusable({ parent, name, type }));
      });

      useUnmount(() => {
        Shim.unregister(name, "beforeActive");
        dispatch(removeFocusable({ parent, name, type }));
      });

      return (
        <FocusContext.Provider value={{ parent: name }}>
          <Component active={active} type={type} {...props} />
        </FocusContext.Provider>
      );
    }
  );
};

const RootFocusable = withFocus((props) => <div {...props} />);
export const RootProvider = ({ children, activeNode = "root" }) => (
  <FocusContext.Provider value={{ parent: null }}>
    <RootFocusable name="root" type="row">
      {children}
    </RootFocusable>
  </FocusContext.Provider>
);
