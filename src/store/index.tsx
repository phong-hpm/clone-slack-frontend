import { configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";

// middleware
import logger from "redux-logger";
import thunk from "redux-thunk";

// reducer
import authReducer from "./slices/auth.slice";
import teamsReducer from "./slices/teams.slice";
import channelsReducer from "./slices/channels.slice";
import messagesReducer from "./slices/messages.slice";
import usersReducer from "./slices/users.slice";
import { setupAxios } from "../utils/axios";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teams: teamsReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false }).concat([thunk, logger]);
  },
});

setupAxios(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch = () => useReduxDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
