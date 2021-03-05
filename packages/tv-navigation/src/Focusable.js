import React, { useState, useMemo, useEffect, useCallback } from "react";
import { connect, useDispatch } from "react-redux";
import cn from "classnames";

import { focus as focusActions } from "./focus";
import Shim from "./shim";
import { store } from "./store";
import { useWillMount, useUnmount } from "./utils";

const {
  subscribe,
  addFocusable,
  removeFocusable,
  focus,
  left,
  right,
  up,
  down 
} = focusActions

const FocusContext = React.createContext({});
const useFocus = () => React.useContext(FocusContext);

const useActive = (name) => {
  const [active, setActive] = useState(false);

  subscribe((state) => {
    if(state.activeNode.name === name) {
      setActive(true);
    } else if (active === true) {
      setActive(false);
    }
  });

  return active;
}

export const createBeforeActive = (name) => {
  return (fn) => void Shim.register(name, "beforeActive", fn);
};

export const focused = (type) => (Component) => {
  return ({ name, container, className, ...props }) => {
    const { parent } = useFocus();
    const active = useActive(name);

    useWillMount(() => {
      addFocusable({ parent, name, type, container });
    });

    useUnmount(() => {
      Shim.unregister(name);
      removeFocusable({ parent, name, type });
    });

    return (
      <FocusContext.Provider value={{ parent: name }}>
        <Component
          className={cn("focusable", type, className)}
          active={active}
          type={type}
          name={name}
          container={container}
          {...props}
        />
      </FocusContext.Provider>
    );
  }
};

export const focusedCol = focused("col");
export const focusedRow = focused("row");

const Root = focusedRow((props) => <div {...props} />);
export const RootFocusRow = (props) => {
  return (<RootFocus {...props} />);
};

export const RootFocus = ({
  children,
  className,
  initialFocusNode = "root",
}) => {
  const handleRight = () => void right();
  const handleLeft = () => void left();
  const handleDown = () => void down();
  const handleUp = () => void up();

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
    initialFocusNode && focus(initialFocusNode);
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
