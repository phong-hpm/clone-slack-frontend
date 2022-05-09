import { createContext, FC, useCallback, useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";

// redux store
import { useDispatch, useSelector } from "store";

// redux selectors
import * as authSelectors from "store/selectors/auth.selector";
import * as teamsSelectors from "../../../store/selectors/teams.selector";

// redux slices
import {
  ChannelType,
  setChannelsList,
  setDirectMessagesList,
  addChannelList,
} from "store/slices/channels.slice";
import { setUserList, updateUserOnline, UserType } from "store/slices/users.slice";

// hooks
import useSocket from "hooks/useSocket";

// utils
import { SocketEvent, SocketEventDefault } from "utils/constants";

export interface ChannelContextType {
  socket?: Socket;
  isConnected: boolean;
  updateNamespace: (name: string) => void;
}

const initialContext: ChannelContextType = {
  isConnected: false,
  updateNamespace: () => {},
};

export const ChannelSocketContext = createContext<ChannelContextType>(initialContext);

export interface ChannelSocketProviderProps {
  children: React.ReactNode;
}

export const ChannelSocketProvider: FC<ChannelSocketProviderProps> = ({ children }) => {
  const dispatch = useDispatch();

  const user = useSelector(authSelectors.getUser);
  const selectedTeamId = useSelector(teamsSelectors.getSelectedId);

  const { socket, updateNamespace } = useSocket();

  const [isConnected, setConnected] = useState(false);

  const addNewChannel = useCallback(
    (channel: ChannelType) => dispatch(addChannelList(channel)),
    [dispatch]
  );

  const updateUserStatus = useCallback(
    (id: string, isOnline: boolean) => dispatch(updateUserOnline({ id, isOnline })),
    [dispatch]
  );

  const updateChannels = useCallback(
    (data: { channels?: ChannelType[]; users?: UserType[] }) => {
      const { channels, users } = data || {};

      if (users) dispatch(setUserList(users));

      if (channels) {
        const channelsList: ChannelType[] = [];
        const directMessagesList: ChannelType[] = [];
        channels.forEach((channel: ChannelType) => {
          channel.type === "direct_message"
            ? directMessagesList.push(channel)
            : channelsList.push(channel);
        });
        dispatch(setChannelsList(channelsList));
        dispatch(setDirectMessagesList(directMessagesList));
      }
    },
    [dispatch]
  );

  // update namespace for socket with [teamId]
  useEffect(() => {
    if (selectedTeamId) updateNamespace(`/${selectedTeamId}`);
  }, [selectedTeamId, updateNamespace]);

  useEffect(() => {
    if (!socket) return;

    socket
      // Step 2: connecting socket
      .on(SocketEventDefault.CONNECT, () => {
        setConnected(true);
        // Step 3: asking for channels data
        socket.emit(SocketEvent.EMIT_LOAD_CHANNELS, { userId: user.id });
      })
      .on(SocketEventDefault.DISCONNECT, () => {
        setConnected(false);
      });

    socket
      // Step 4: looking for channels data
      .on(SocketEvent.ON_CHANNELS, updateChannels)
      // looking for new channel data, which just added
      .on(SocketEvent.ON_ADDED_CHANNEL, addNewChannel)
      // looking for new user online, who just logined
      .on(SocketEvent.ON_USER_ONLINE, (id: string) => updateUserStatus(id, true))
      // looking for new user online, who just logouted
      .on(SocketEvent.ON_USER_OFFLINE, (id: string) => updateUserStatus(id, false));

    // Step 1: trigger connect socket
    socket.connect();
    return () => {
      // disconnect socket
      socket?.disconnect();
    };
  }, [user, socket, updateChannels, addNewChannel, updateUserStatus]);

  const value = useMemo(
    () => ({
      socket,
      isConnected,
      updateNamespace,
    }),
    [socket, isConnected, updateNamespace]
  );

  return <ChannelSocketContext.Provider value={value}>{children}</ChannelSocketContext.Provider>;
};

export default ChannelSocketProvider;
