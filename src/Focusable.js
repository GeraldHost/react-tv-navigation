import React, { useMemo, useEffect, useCallback } from "react";
import { connect, useDispatch } from "react-redux";
import cn from "classnames";

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
  active: state.activeNode.name === props.name,
});

export const focused = (type) => (Component) => {
  return connect(mapStateToProps)(
    ({ active, name, container, className, beforeActive, ...props }) => {
      const { parent } = useFocus();
      const dispatch = useDispatch();

      useWillMount(() => {
        if (beforeActive) {
          Shim.register(name, "beforeActive", beforeActive);
        }
        dispatch(addFocusable({ parent, name, type, container }));
      });

      useUnmount(() => {
        Shim.unregister(name, "beforeActive");
        dispatch(removeFocusable({ parent, name, type }));
      });

      return (
        <FocusContext.Provider value={{ parent: name }}>
          <Component
            className={cn("focusable", type, className)}
            active={active}
            type={type}
            {...props}
          />
        </FocusContext.Provider>
      );
    }
  );
};

export const focusedCol = focused("col");
export const focusedRow = focused("row");

const Root = focusedRow((props) => <div {...props} />);
export const RootFocusRow = ({
  children,
  className,
  initialFocusNode = "root",
}) => {
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
      <Root name="root" className={className}>
        {children}
      </Root>
    </FocusContext.Provider>
  );
};
