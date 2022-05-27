import * as Redux from "redux";
import { ActionCreatorWithPayload, PayloadAction } from "@reduxjs/toolkit";

import { store } from "./";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// middlewares
export type WatcherType = (
  callback: (
    state: RootState,
    dispatch: Redux.Dispatch,
    action: PayloadAction<any, string>
  ) => void,
  dependences: (ActionCreatorWithPayload<any> | string)[]
) => void;

export type WatcherHandlerType = (watcher: WatcherType) => void;
