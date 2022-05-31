import { createContext, FC, useCallback, useEffect, useMemo } from "react";

// redux store
import { useDispatch, useSelector } from "store";

// redux selectors
import * as teamsSelectors from "store/selectors/teams.selector";

// redux slices
import {
  setChannelsList,
  setDirectMessagesList,
  addChannel,
  updateChannel,
} from "store/slices/channels.slice";
import { updateChannelUserOnline } from "store/slices/channelUsers.slice";

// hooks
import useSocket from "hooks/useSocket";

// utils
import cacheUtils from "utils/cacheUtils";
import { SocketEvent, SocketEventDefault } from "utils/constants";

// types
import { ChannelType } from "store/slices/_types";
import {
  AddNewChannelListener,
  ChannelContextType,
  LoadChannelsListener,
  UpdateChannelUnreadMessageCountListener,
  UpdateChannelUpdatedTimeListener,
  UpdateChannelUserStatusListener,
} from "./_types";
import { setTeamUserList } from "store/slices/teamUsers.slice";

const initialContext: ChannelContextType = {
  updateNamespace: () => {},
};

export const ChannelSocketContext = createContext<ChannelContextType>(initialContext);

export interface ChannelSocketProviderProps {
  children: React.ReactNode;
}

export const ChannelSocketProvider: FC<ChannelSocketProviderProps> = ({ children }) => {
  const dispatch = useDispatch();

  const selectedTeamId = useSelector(teamsSelectors.getSelectedTeamId);

  const { socket, updateNamespace } = useSocket();

  const handleAddNewChannel: AddNewChannelListener = useCallback(
    (channel) => dispatch(addChannel(channel)),
    [dispatch]
  );

  const handleUpdateUserStatus: UpdateChannelUserStatusListener = useCallback(
    (id, isOnline) => dispatch(updateChannelUserOnline({ id, isOnline })),
    [dispatch]
  );

  const handleSetChannelList: LoadChannelsListener = useCallback(
    ({ channels, users: teamUsers }) => {
      dispatch(setTeamUserList(teamUsers));

      if (channels) {
        const channelsList: ChannelType[] = [];
        const directMessagesList: ChannelType[] = [];

        // separate [channels] for each [channel.type]
        channels.forEach((channel: ChannelType) => {
          ["direct_message", "group_message"].includes(channel.type)
            ? directMessagesList.push(channel)
            : channelsList.push(channel);
          // update cachedModify for channel
          cacheUtils.setChannelUpdatedTime(channel.id, { channel: channel.updatedTime });
        });
        dispatch(setChannelsList(channelsList));
        dispatch(setDirectMessagesList(directMessagesList));
      }
    },
    [dispatch]
  );

  const handleUpdateChannelUpdatedTime: UpdateChannelUpdatedTimeListener = useCallback(
    ({ channelId, updatedTime }) => {
      dispatch(updateChannel({ id: channelId, channel: { updatedTime } }));
      // update cachedModify for channel
      cacheUtils.setChannelUpdatedTime(channelId, { channel: updatedTime });
    },
    [dispatch]
  );

  const handleUpdateChannelUnreadCount: UpdateChannelUnreadMessageCountListener = useCallback(
    ({ channelId, unreadMessageCount }) => {
      dispatch(updateChannel({ id: channelId, channel: { unreadMessageCount } }));
    },
    [dispatch]
  );

  // update namespace for socket with [teamId]
  useEffect(() => {
    // [updateNamespace] will disconnect socket
    if (selectedTeamId) updateNamespace(`/${selectedTeamId}`);
  }, [selectedTeamId, updateNamespace]);

  useEffect(() => {
    if (!socket) return;

    socket
      // Step 2: connecting socket
      .on(SocketEventDefault.CONNECT, () => {
        // Step 3: asking for channels data
        socket.emit(SocketEvent.EMIT_LOAD_CHANNELS);
      })
      .on(SocketEventDefault.DISCONNECT, () => {});

    socket
      .on(SocketEvent.ON_CHANNELS, handleSetChannelList)
      .on(SocketEvent.ON_ADDED_CHANNEL, handleAddNewChannel)
      .on(SocketEvent.ON_EDITED_CHANNEL_UPDATED_TIME, handleUpdateChannelUpdatedTime)
      .on(SocketEvent.ON_EDITED_CHANNEL_UNREAD_MESSAGE_COUNT, handleUpdateChannelUnreadCount)
      .on(SocketEvent.ON_USER_ONLINE, (id: string) => handleUpdateUserStatus(id, true))
      .on(SocketEvent.ON_USER_OFFLINE, (id: string) => handleUpdateUserStatus(id, false));

    // Step 1: trigger connect socket
    // fire [socket.connect] only 1 time
    !socket.connected && socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [
    socket,
    handleSetChannelList,
    handleUpdateChannelUpdatedTime,
    handleUpdateChannelUnreadCount,
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
