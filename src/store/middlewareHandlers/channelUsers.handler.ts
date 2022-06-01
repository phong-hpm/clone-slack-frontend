// redux selectors
import channelsSelectors from "store/selectors/channels.selector";
import teamUsersSelectors from "store/selectors/teamUsers.selector";

// redux slices
import {
  setChannelsList,
  setDirectMessagesList,
  setSelectedChannelId,
  updateChannelParterOnline,
} from "store/slices/channels.slice";
import { setChannelUserList, updateChannelUserOnline } from "store/slices/channelUsers.slice";
import { setTeamUserList, updateTeamUserOnline } from "store/slices/teamUsers.slice";

// types
import { WatcherType } from "store/_types";

const channelUsersHandlers = (watcher: WatcherType) => {
  // [setSelectedChannelId], [setChannelsList], [setDirectMessagesList]
  // these actions can be fired asynchonous, so we listen all of them
  watcher(
    (state, dispatch) => {
      const selectedChannel = channelsSelectors.getSelectedChannel(state);
      const teamUserList = teamUsersSelectors.getTeamUserList(state);

      if (selectedChannel && teamUserList.length) {
        const channelUserIds = selectedChannel.users;
        const channelUserList = teamUserList.filter((user) => channelUserIds.includes(user.id));
        dispatch(setChannelUserList(channelUserList));
      }
    },
    [setTeamUserList, setSelectedChannelId, setChannelsList, setDirectMessagesList]
  );

  watcher(
    (state, dispatch, action: ReturnType<typeof updateChannelUserOnline>) => {
      const { id, isOnline = false } = action.payload;
      dispatch(updateChannelParterOnline({ id, online: isOnline }));
      dispatch(updateTeamUserOnline(action.payload));
    },
    [updateChannelUserOnline]
  );
};

export default channelUsersHandlers;
