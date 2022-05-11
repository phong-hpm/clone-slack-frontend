import { configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";

// middleware
import thunk from "redux-thunk";

// reducer
import authReducer from "store/slices/auth.slice";
import teamsReducer from "store/slices/teams.slice";
import channelsReducer from "store/slices/channels.slice";
import messagesReducer from "store/slices/messages.slice";
import usersReducer from "store/slices/users.slice";

// utils
import { setupAxios } from "utils/axios";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teams: teamsReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false }).concat([thunk]);
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
