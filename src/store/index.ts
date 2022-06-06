import { configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";

// middleware
import thunk from "redux-thunk";

// reducer
import userReducer from "store/slices/user.slice";
import teamsReducer from "store/slices/teams.slice";
import teamUsersReducer from "store/slices/teamUsers.slice";
import channelsReducer from "store/slices/channels.slice";
import channelUsersReducer from "store/slices/channelUsers.slice";
import messagesReducer from "store/slices/messages.slice";
import socketReducer from "store/slices/socket.slice";
import globalModalReducer from "store/slices/globalModal.slice";

// utils
import { setupAxios } from "utils/axios";

// middlewares
import { middlewareAfterRegister } from "store/middlewareRegister";
import messagesHandlers from "store/middlewareHandlers/messages.handler";
import channelUsersHandlers from "./middlewareHandlers/channelUsers.handler";
import { createLogger } from "redux-logger";

// types
import { AppDispatch, RootState } from "store/_types";

export const store = configureStore({
  reducer: {
    user: userReducer,
    teams: teamsReducer,
    teamUsers: teamUsersReducer,
    channels: channelsReducer,
    channelUsers: channelUsersReducer,
    messages: messagesReducer,
    socket: socketReducer,
    globalModal: globalModalReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false }).concat([
      thunk,
      createLogger({ collapsed: true, diff: true }),
      middlewareAfterRegister(messagesHandlers, channelUsersHandlers),
    ]);
  },
});

setupAxios(store);

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch = () => useReduxDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
