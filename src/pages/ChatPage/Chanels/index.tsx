import { FC, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";

// redux store
import { useSelector } from "../../../store";

// redux selectors
import * as authSelectors from "../../../store/selectors/auth.selector";
import * as teamsSelectors from "../../../store/selectors/teams.selector";
import * as chanelsSelectors from "../../../store/selectors/chanels.selector";

// redux slices
import {
  ChanelType,
  setChanelsList,
  setDirectMessagesList,
  addChanelList,
  setSelectedChanelId,
} from "../../../store/slices/chanels.slice";
import { setUserList, UserType } from "../../../store/slices/users.slice";

// utils
import { SocketEvent, SocketEventDefault } from "../../../utils/constants";

// hooks
import useSocket from "../../../hooks/useSocket";

// components
import ChanelContent from "./ChanelContent";

const Chanels: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(authSelectors.getUser);
  const selectedTeamId = useSelector(teamsSelectors.getSelectedId);
  const selectedChanelId = useSelector(chanelsSelectors.getSelectedChanelId);
  const chanelList = useSelector(chanelsSelectors.getChanelList);

  const { socket, updateNamespace } = useSocket();

  const handleSendChanel = (chanelName: string, desc: string) => {
    console.log(chanelName, desc);
    socket?.emit(SocketEvent.EMIT_ADD_CHANEL, { userId: user.id, data: { chanelName } });
  };

  const addNewChanel = useCallback(
    (chanel: ChanelType) => dispatch(addChanelList(chanel)),
    [dispatch]
  );

  const updateChanels = useCallback(
    (data: { chanels?: ChanelType[]; users?: UserType[] }) => {
      const { chanels, users } = data || {};

      if (users) dispatch(setUserList(users));

      if (chanels) {
        const chanelsList: ChanelType[] = [];
        const directMessagesList: ChanelType[] = [];
        chanels.forEach((chanel: ChanelType) => {
          chanel.type === "direct_message"
            ? directMessagesList.push(chanel)
            : chanelsList.push(chanel);
        });
        dispatch(setChanelsList(chanelsList));
        dispatch(setDirectMessagesList(directMessagesList));
      }
    },
    [dispatch]
  );

  // after got chanelList
  // when selectedChanelId is emtpy
  // set general chanel as  selected chanel
  useEffect(() => {
    if (selectedChanelId || !chanelList.length) return;

    const generalChanel = chanelList.find((chanel) => chanel.name === "general")!;

    dispatch(setSelectedChanelId(generalChanel.id));
    navigate(generalChanel.id);
  }, [selectedChanelId, chanelList, navigate, dispatch]);

  // update namespace for socket
  useEffect(() => {
    if (selectedTeamId) {
      updateNamespace(`/${selectedTeamId}`);
    }
  }, [selectedTeamId, updateNamespace]);

  // setup socket Chanels
  useEffect(() => {
    if (!socket) return;

    socket
      .on(SocketEventDefault.CONNECT, () => {
        socket.emit(SocketEvent.EMIT_LOAD_CHANELS, { userId: user.id });
      })
      .on(SocketEventDefault.DISCONNECT, () => {
        console.log("disconnected");
      });

    socket.on(SocketEvent.ON_CHANELS, updateChanels).on(SocketEvent.ON_NEW_CHANEL, addNewChanel);

    socket.connect();
    return () => {
      socket?.disconnect();
    };
  }, [user, socket, updateChanels, addNewChanel]);

  // wait for setting selected chanel id
  if (!selectedChanelId) return null;

  return (
    <Routes>
      <Route
        path="/:chanelId"
        element={
          <>
            <ChanelContent onAddChanel={handleSendChanel} />
          </>
        }
      />
    </Routes>
  );
};

export default Chanels;
