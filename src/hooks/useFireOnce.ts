import { useCallback, useRef } from "react";
import { v4 as uuid } from "uuid";

/*
  This hook support for firing any function only 1 time
    util component unmounted or request a new one
*/

const firedIds: Record<string, boolean> = {};

const useFireOnce = () => {
  const keepRef = useRef({ fireId: uuid() });

  // this function will fire the callback only 1 time until id be reseted
  const fireOnce = useCallback((cb: Function) => {
    if (!firedIds[keepRef.current.fireId]) {
      firedIds[keepRef.current.fireId] = true;
      cb();
    }
  }, []);

  // this function will fire the callback only 1 time until id be reseted
  const fireIdOnce = useCallback((id: string, cb: Function) => {
    if (!firedIds[`${keepRef.current.fireId}-${id}`]) {
      firedIds[`${keepRef.current.fireId}-${id}`] = true;
      cb();
    }
  }, []);

  return { fireOnce, fireIdOnce };
};

export default useFireOnce;
