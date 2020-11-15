import React, { useMemo, useEffect } from "react";
import { connect, useDispatch } from "react-redux";

import { addFocusable, removeFocusable, focus } from "./focusStore";
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
    ({ active, name, type = "row", container, beforeActive, ...props }) => {
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

const RootFocusable = withFocus(({children}) => <div>{children}</div>);
export const RootProvider = ({ children, initialFocusNode = "root" }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if(initialFocusNode) {
      dispatch(focus(initialFocusNode))
    }
  }, []);

  return (
    <FocusContext.Provider value={{ parent: null }}>
      <RootFocusable name="root" type="row">
        {children}
      </RootFocusable>
    </FocusContext.Provider>
  )
}