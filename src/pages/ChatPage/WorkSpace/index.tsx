import { FC, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";

// redux store
import { useSelector } from "../../../store";

// redux selectors
import * as authSelectors from "../../../store/selectors/auth.selector";
import * as teamsSelectors from "../../../store/selectors/teams.selector";
import * as channelsSelectors from "../../../store/selectors/channels.selector";

// redux slices
import {
  ChannelType,
  setChannelsList,
  setDirectMessagesList,
  addChannelList,
  setSelectedChannelId,
} from "../../../store/slices/channels.slice";
import { setUserList, UserType } from "../../../store/slices/users.slice";

// utils
import { SocketEvent, SocketEventDefault } from "../../../utils/constants";

// hooks
import useSocket from "../../../hooks/useSocket";

// components
import Channels from "./Channels";

const WorkSpace: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(authSelectors.getUser);
  const selectedTeamId = useSelector(teamsSelectors.getSelectedId);
  const selectedChannelId = useSelector(channelsSelectors.getSelectedChannelId);
  const channelList = useSelector(channelsSelectors.getChannelList);

  const { socket, updateNamespace } = useSocket();

  const handleSendChannel = (channelName: string, desc: string) => {
    console.log(channelName, desc);
    socket?.emit(SocketEvent.EMIT_ADD_CHANNEL, { userId: user.id, data: { channelName } });
  };

  const addNewChannel = useCallback(
    (channel: ChannelType) => dispatch(addChannelList(channel)),
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

  // after got channelList
  // when selectedChannelId is emtpy
  // set general channel as  selected channel
  useEffect(() => {
    if (selectedChannelId || !channelList.length) return;

    const generalChannel = channelList.find((channel) => channel.name === "general")!;

    dispatch(setSelectedChannelId(generalChannel.id));
    navigate(generalChannel.id);
  }, [selectedChannelId, channelList, navigate, dispatch]);

  // update namespace for socket
  useEffect(() => {
    if (selectedTeamId) {
      updateNamespace(`/${selectedTeamId}`);
    }
  }, [selectedTeamId, updateNamespace]);

  // setup socket Channels
  useEffect(() => {
    if (!socket) return;

    socket
      .on(SocketEventDefault.CONNECT, () => {
        socket.emit(SocketEvent.EMIT_LOAD_CHANNELS, { userId: user.id });
      })
      .on(SocketEventDefault.DISCONNECT, () => {});

    socket
      .on(SocketEvent.ON_CHANNELS, updateChannels)
      .on(SocketEvent.ON_NEW_CHANNEL, addNewChannel);

    socket.connect();
    return () => {
      socket?.disconnect();
    };
  }, [user, socket, updateChannels, addNewChannel]);

  // wait for setting selected channel id
  if (!selectedChannelId) return null;

  return (
    <Routes>
      <Route
        path="/:channelId"
        element={
          <>
            <Channels onAddChannel={handleSendChannel} />
          </>
        }
      />
    </Routes>
  );
};

export default WorkSpace;
