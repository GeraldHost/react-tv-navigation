import { useMemo, useEffect } from "react";

export const useWillMount = (fn) => {
  useMemo(() => fn(), []);
};

export const useUnmount = (fn) => {
  useEffect(() => {
    return () => fn();
  }, []);
};
