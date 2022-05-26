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

// middlewares
import { middlewareAfterRegister } from "store/middlewareRegister";
import messagesHandlers from "store/middlewareHandlers/messages.handler";

// types
import { AppDispatch, RootState } from "store/_types";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teams: teamsReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false }).concat([
      thunk,
      middlewareAfterRegister(messagesHandlers),
    ]);
  },
});

setupAxios(store);

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch = () => useReduxDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
