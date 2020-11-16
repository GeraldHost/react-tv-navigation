import React, { useMemo, useEffect, useCallback } from "react";
import { connect, useDispatch } from "react-redux";

import {
  addFocusable,
  removeFocusable,
  focus,
  left,
  right,
  up,
  down,
} from "./focusStore";
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

export const withFocus = (type) => (Component) => {
  return connect(mapStateToProps)(
    ({ active, name, container, beforeActive, ...props }) => {
      const { parent } = useFocus();
      const dispatch = useDispatch();

      useWillMount(() => {
        Shim.register(name, "beforeActive", beforeActive);
        dispatch(addFocusable({ parent, name, type, container }));
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

export const withFocusCol = withFocus("col");
export const withFocusRow = withFocus("row");

const RootFocusable = withFocusRow(({ children }) => <div>{children}</div>);
export const RootProvider = ({ children, initialFocusNode = "root" }) => {
  const dispatch = useDispatch();

  const handleRight = () => void dispatch(right());
  const handleLeft = () => void dispatch(left());
  const handleDown = () => void dispatch(down());
  const handleUp = () => void dispatch(up());

  const handleKeyPress = useCallback(
    (event) => {
      const fn = {
        38: handleUp,
        37: handleLeft,
        39: handleRight,
        40: handleDown,
      }[event.keyCode];
      fn && fn();
      event.stopPropagation();
    },
    [handleUp, handleLeft, handleRight, handleDown]
  );

  useEffect(() => {
    initialFocusNode && dispatch(focus(initialFocusNode));
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <FocusContext.Provider value={{ parent: null }}>
      <RootFocusable name="root" type="row">
        {children}
      </RootFocusable>
    </FocusContext.Provider>
  );
};

