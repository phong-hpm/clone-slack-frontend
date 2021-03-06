import { useCallback, useEffect } from "react";

// redux store
import { useDispatch, useSelector } from "store";

// redux selectors
import teamsSelectors from "store/selectors/teams.selector";

// redux slices
import {
  setChannelsList,
  addChannel,
  updateChannel,
  removeChannel,
} from "store/slices/channels.slice";
import { setChannelUserList, updateChannelUserOnline } from "store/slices/channelUsers.slice";
import { setChannelSocket } from "store/slices/socket.slice";
import { setTeamUserList } from "store/slices/teamUsers.slice";

// hooks
import useSocket from "hooks/useSocket";

// utils
import cacheUtils from "utils/cacheUtils";
import { SocketEvent, SocketEventDefault } from "utils/constants";

// types
import {
  AddNewChannelListener,
  LoadChannelsListener,
  UpdateChannelUnreadMessageCountListener,
  UpdateChannelUpdatedTimeListener,
  UpdateChannelUserStatusListener,
  UpdatedChannelListener,
  UpdatedChannelUsersListener,
  UpdatedRemovedListener,
} from "./_types";

export const ChannelSocketListener = () => {
  const dispatch = useDispatch();

  const selectedTeamId = useSelector(teamsSelectors.getSelectedTeamId);

  const { socket, updateNamespace } = useSocket();

  const handleSetChannelList: LoadChannelsListener = useCallback(
    ({ channels, users: teamUsers }) => {
      dispatch(setTeamUserList(teamUsers));
      dispatch(setChannelsList(channels));
    },
    [dispatch]
  );

  const handleAddNewChannel: AddNewChannelListener = useCallback(
    ({ channel }) => dispatch(addChannel(channel)),
    [dispatch]
  );

  const handleUpdatedChannel: UpdatedChannelListener = useCallback(
    ({ channel }) => {
      dispatch(updateChannel({ id: channel.id, channel }));
    },
    [dispatch]
  );

  const handleRemovedChannel: UpdatedRemovedListener = useCallback(
    ({ channelId }) => {
      cacheUtils.removeCachedMessages({ channelId });
      dispatch(removeChannel(channelId));
    },
    [dispatch]
  );

  const handleUpdatedChannelUsers: UpdatedChannelUsersListener = useCallback(
    ({ channelId, userId, users }) => {
      dispatch(updateChannel({ id: channelId, channel: { users: userId } }));
      dispatch(setChannelUserList(users));
    },
    [dispatch]
  );

  const handleUpdateUserStatus: UpdateChannelUserStatusListener = useCallback(
    (id, isOnline) => dispatch(updateChannelUserOnline({ id, isOnline })),
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
    dispatch(setChannelSocket(socket));

    socket
      // Step 2: connecting socket
      .on(SocketEventDefault.CONNECT, () => {
        // Step 3: asking for channels data
        socket.emit(SocketEvent.EMIT_LOAD_CHANNELS);
      })
      .on(SocketEventDefault.DISCONNECT, () => {})
      .on(SocketEventDefault.CONNECT_ERROR, (error) => {
        console.log("SocketEventDefault.CONNECT_ERROR", error);
      });

    socket
      .on(SocketEvent.ON_CHANNELS, handleSetChannelList)
      .on(SocketEvent.ON_ADDED_CHANNEL, handleAddNewChannel)
      .on(SocketEvent.ON_EDITED_CHANNEL, handleUpdatedChannel)
      .on(SocketEvent.ON_REMOVED_CHANNEL, handleRemovedChannel)
      .on(SocketEvent.ON_EDITED_CHANNEL_USERS, handleUpdatedChannelUsers)
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
    dispatch,
    handleSetChannelList,
    handleUpdatedChannel,
    handleRemovedChannel,
    handleUpdatedChannelUsers,
    handleUpdateChannelUpdatedTime,
    handleUpdateChannelUnreadCount,
    handleAddNewChannel,
    handleUpdateUserStatus,
  ]);

  return <></>;
};

export default ChannelSocketListener;
