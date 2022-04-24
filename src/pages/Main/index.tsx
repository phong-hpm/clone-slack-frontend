import { FC, useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";

// redux store
import { useSelector } from "../../store";

// redux selectors
import * as authSelectors from "../../store/selectors/auth.selector";
import * as teamsSelectors from "../../store/selectors/teams.selector";
import * as chanelsSelectors from "../../store/selectors/chanels.selector";

// redux slices
import {
  ChanelType,
  setChanelsList,
  setDirectMessagesList,
  addChanelList,
  setSelectedChanelId,
} from "../../store/slices/chanels.slice";
import { setSelectedTeamId } from "../../store/slices/teams.slice";
import { setUserList, UserType } from "../../store/slices/users.slice";

// utils
import { RouterPath, SocketEvent, SocketEventDefault, teamIdRegExp } from "../../utils/constants";

// hooks
import useSocket from "../../hooks/useSocket";

// components
import Chanel from "./Chanels";

export interface ValidateTeamPathProps {
  children: JSX.Element;
}

export const ValidateTeamPath: FC<ValidateTeamPathProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teamId } = useParams();

  const stateRef = useRef<{ checkItemId?: string }>({});

  // check teamId params, if not match, navigate to teams
  useEffect(() => {
    if (!teamId || stateRef.current.checkItemId === teamId) return;
    stateRef.current.checkItemId = teamId;

    // T-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
    if (!teamIdRegExp.test(teamId)) {
      // navigate to TEAM_PAGE if teamId is wrong format
      navigate(RouterPath.TEAM_PAGE);
    } else {
      dispatch(setSelectedTeamId(teamId));
    }
  }, [teamId, navigate, dispatch]);

  return children;
};

const ChatPage: FC = () => {
  const dispatch = useDispatch();
  const { teamId } = useParams();
  const navigate = useNavigate();

  const user = useSelector(authSelectors.getUser);
  const selectedTeamId = useSelector(teamsSelectors.getSelectedId);
  const selectedChanelId = useSelector(chanelsSelectors.getSelectedChanelId);

  const { socket, updateNamespace } = useSocket();

  const handleSendChanel = (chanelName: string) => {
    socket?.emit(SocketEvent.EMIT_ADD_CHANEL, {
      userId: user.id,
      data: { chanelName },
    });
  };

  const addNewChanel = useCallback(
    (chanel: ChanelType) => dispatch(addChanelList(chanel)),
    [dispatch]
  );

  const handleSelectChanel = (id: string) => {
    dispatch(setSelectedChanelId(id));
  };

  const updateChanels = useCallback(
    (data: { chanels?: ChanelType[]; users?: UserType[] }) => {
      const { chanels, users } = data || {};

      if (users) {
        dispatch(setUserList(users));
      }

      if (chanels) {
        const chanelsList: ChanelType[] = [];
        const directMessagesList: ChanelType[] = [];
        chanels.forEach((chanel: ChanelType) =>
          chanel.type === "direct_message"
            ? directMessagesList.push(chanel)
            : chanelsList.push(chanel)
        );
        const generalChanel = chanels.find((chanel) => chanel.name === "general")!;
        dispatch(setSelectedChanelId(generalChanel.id));
        dispatch(setChanelsList(chanelsList));
        dispatch(setDirectMessagesList(directMessagesList));
      }
    },
    [dispatch]
  );

  // update namespace for socket
  useEffect(() => {
    if (!selectedTeamId && !teamId) return;
    updateNamespace(`/${selectedTeamId}`);
  }, [teamId, selectedTeamId, updateNamespace]);

  // handle selectedChanel
  // update socket namespace and navigate
  useEffect(() => {
    if (selectedChanelId) {
      navigate(`/${selectedTeamId}/${selectedChanelId}`);
    }
  }, [selectedTeamId, selectedChanelId, navigate]);

  // socket
  useEffect(() => {
    if (!socket) return;

    socket
      .on(SocketEventDefault.CONNECT, () => {
        console.log("connected");
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

  return (
    <Routes>
      <Route
        path="/:chanelId"
        element={<Chanel onAddChanel={handleSendChanel!} onSelectChanel={handleSelectChanel} />}
      />
    </Routes>
  );
};

export default ChatPage;
