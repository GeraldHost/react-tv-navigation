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
  isActive: state.activeNode === props.name,
});

export const Focusable = connect(mapStateToProps)(
  ({ isActive, children, name, type = "row", beforeActive }) => {
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
        <div className={`focusable ${isActive && "active"} ${type}`}>
          {children}
        </div>
      </FocusContext.Provider>
    );
  }
);

export const RootProvider = ({ children }) => (
  <FocusContext.Provider value={{ parent: null }}>
    <Focusable name="root" type="row">
      {children}
    </Focusable>
  </FocusContext.Provider>
);
