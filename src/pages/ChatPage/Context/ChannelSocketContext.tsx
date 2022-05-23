import { createContext, FC, useCallback, useEffect, useMemo } from "react";

// redux store
import { useDispatch, useSelector } from "store";

// redux selectors
import * as authSelectors from "store/selectors/auth.selector";
import * as teamsSelectors from "store/selectors/teams.selector";

// redux slices
import {
  setChannelsList,
  setDirectMessagesList,
  addChannelList,
  updateChannel,
} from "store/slices/channels.slice";
import { setUserList, updateUserOnline } from "store/slices/users.slice";

// hooks
import useSocket from "hooks/useSocket";

// utils
import { SocketEvent, SocketEventDefault } from "utils/constants";

// types
import { UserType, ChannelType } from "store/slices/_types";
import { ChannelContextType } from "./_types";

const initialContext: ChannelContextType = {
  updateNamespace: () => {},
};

export const ChannelSocketContext = createContext<ChannelContextType>(initialContext);

export interface ChannelSocketProviderProps {
  children: React.ReactNode;
}

export const ChannelSocketProvider: FC<ChannelSocketProviderProps> = ({ children }) => {
  const dispatch = useDispatch();

  const user = useSelector(authSelectors.getUser);
  const selectedTeamId = useSelector(teamsSelectors.getSelectedTeamId);

  const { socket, updateNamespace } = useSocket();

  const handleAddNewChannel = useCallback(
    (channel: ChannelType) => dispatch(addChannelList(channel)),
    [dispatch]
  );

  const handleUpdateUserStatus = useCallback(
    (id: string, isOnline: boolean) => dispatch(updateUserOnline({ id, isOnline })),
    [dispatch]
  );

  const handleSetChannelList = useCallback(
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

  const handleUpdateChannelUnreadMessageCount = useCallback(
    (channelId: string, unreadMessageCount: number) =>
      dispatch(updateChannel({ id: channelId, channel: { unreadMessageCount } })),
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
        // Step 3: asking for channels data
        socket.emit(SocketEvent.EMIT_LOAD_CHANNELS, { userId: user.id });
      })
      .on(SocketEventDefault.DISCONNECT, () => {});

    socket
      .on(SocketEvent.ON_CHANNELS, handleSetChannelList)
      .on(SocketEvent.ON_ADDED_CHANNEL, handleAddNewChannel)
      .on(SocketEvent.ON_EDITED_CHANNEL_UNREAD_MESSAGE_COUNT, handleUpdateChannelUnreadMessageCount)
      .on(SocketEvent.ON_USER_ONLINE, (id: string) => handleUpdateUserStatus(id, true))
      .on(SocketEvent.ON_USER_OFFLINE, (id: string) => handleUpdateUserStatus(id, false));

    // Step 1: trigger connect socket
    socket.connect();
    return () => {
      // disconnect socket
      socket?.disconnect();
    };
  }, [
    user,
    socket,
    handleSetChannelList,
    handleUpdateChannelUnreadMessageCount,
    handleAddNewChannel,
    handleUpdateUserStatus,
  ]);

  const value = useMemo(
    () => ({
      socket,
      updateNamespace,
    }),
    [socket, updateNamespace]
  );

  return <ChannelSocketContext.Provider value={value}>{children}</ChannelSocketContext.Provider>;
};

export default ChannelSocketProvider;
