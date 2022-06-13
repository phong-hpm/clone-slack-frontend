/* istanbul ignore file */
import * as Redux from "redux";
import { PayloadAction } from "@reduxjs/toolkit";

// types
import { RootState, WatcherType, WatcherHandlerType } from "store/_types";

const flashHandlers = (handlers: WatcherHandlerType[] | WatcherHandlerType[][]) => {
  let result: WatcherHandlerType[] = [];
  handlers.forEach((h) => {
    if (!Array.isArray(h)) result.push(h);
    else result = result.concat(h);
  });

  return result;
};

const actionWatcher = (action: PayloadAction<any>, state: RootState, dispatch: Redux.Dispatch) => {
  const watcher: WatcherType = (callback, dependences) => {
    const isMatch = dependences.find((dependence: any) => {
      return dependence === action.type || dependence.type === action.type;
    });
    if (isMatch) {
      callback(state, dispatch, action);
    }
  };
  return watcher;
};

export const middlewareRegister = ({
  beforeHandlers = [],
  afterHandlers = [],
}: {
  beforeHandlers?: WatcherHandlerType[];
  afterHandlers?: WatcherHandlerType[];
}) => {
  const middleware: Redux.Middleware = (storeAPI) => {
    return (next) => (action) => {
      beforeHandlers.forEach((handler) =>
        handler(actionWatcher(action, storeAPI.getState(), storeAPI.dispatch))
      );

      next(action);

      afterHandlers.forEach((handler) =>
        handler(actionWatcher(action, storeAPI.getState(), storeAPI.dispatch))
      );
    };
  };

  return middleware;
};

/**
 * [createSlice] can't access to global redux state, middleware can handle it
 *
 * Register multiple handlers which will be fired BEFORE one of its dependences dispatched to store
 *
 * It is useful when you want to update some states before handler depencences dispatched
 */
export const middlewareBeforeRegister = (
  ...handlers: WatcherHandlerType[] | WatcherHandlerType[][]
) => {
  return middlewareRegister({ beforeHandlers: flashHandlers(handlers) });
};

/**
 * [createSlice] can't access to global redux state, middleware can handle it
 *
 * Register multiple handlers which will be fired AFTER one of its dependences dispatched to store
 *
 * It is useful when handler depencences will update store by some complex logics
 */
export const middlewareAfterRegister = (
  ...handlers: WatcherHandlerType[] | WatcherHandlerType[][]
) => {
  return middlewareRegister({ afterHandlers: flashHandlers(handlers) });
};
