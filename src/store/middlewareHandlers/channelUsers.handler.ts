// redux slices
import { getSelectedChannel } from "store/selectors/channels.selector";
import { getTeamUserList } from "store/selectors/teamUsers.selector";
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";
import { setChannelUserList, updateChannelUserOnline } from "store/slices/channelUsers.slice";
import { setTeamUserList, updateTeamUserOnline } from "store/slices/teamUsers.slice";

// types
import { WatcherType } from "store/_types";

const channelUsersHandlers = (watcher: WatcherType) => {
  watcher(
    (state, dispatch) => {
      const selectedChannel = getSelectedChannel(state);
      const teamUserList = getTeamUserList(state);

      if (selectedChannel && teamUserList.length) {
        const channelUserIds = selectedChannel.users;
        const channelUserList = teamUserList.filter((user) => channelUserIds.includes(user.id));
        dispatch(setChannelUserList(channelUserList));
      }
    },
    [setTeamUserList, setSelectedChannelId, setChannelsList]
  );

  watcher(
    (state, dispatch, action: ReturnType<typeof updateChannelUserOnline>) => {
      dispatch(updateTeamUserOnline(action.payload));
    },
    [updateChannelUserOnline]
  );
};

export default channelUsersHandlers;
