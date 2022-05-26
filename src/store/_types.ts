import * as Redux from "redux";
import { ActionCreatorWithPayload, PayloadAction } from "@reduxjs/toolkit";

import { store } from "./";

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
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
