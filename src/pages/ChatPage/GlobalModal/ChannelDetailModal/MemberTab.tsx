import { useMemo, useState } from "react";

// store
import { useDispatch, useSelector } from "store";

// redux selector
import userSelectors from "store/selectors/user.selector";
import channelsSelectors from "store/selectors/channels.selector";
import channelUsersSelectors from "store/selectors/channelUsers.selector";
import teamUsersSelectors from "store/selectors/teamUsers.selector";

// components
import {
  Box,
  InputAdornment,
  Typography,
  TextField,
  ListItemButton,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import { color, rgba } from "utils/constants";
import UserMentionCard from "components/UserMentionCard";

// types
import { UserType } from "store/slices/_types";
import { searchUser } from "utils/searchUser";
import { setOpenAddUserChannelModal } from "store/slices/globalModal.slice";

const MemberTab = () => {
  const dispatch = useDispatch();

  const userId = useSelector(userSelectors.getUserId);
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);
  const channelUsers = useSelector(channelUsersSelectors.getChannelUserList);
  const teamUsers = useSelector(teamUsersSelectors.getTeamUserList);

  const [searchValue, setSearchValue] = useState("");

  const notInChannelList = useMemo(() => {
    return teamUsers.filter((user) => !channelUsers.find(({ id }) => id === user.id));
  }, [channelUsers, teamUsers]);

  const searchedInChannelList = useMemo(() => {
    return searchUser(channelUsers, searchValue);
  }, [searchValue, channelUsers]);

  const searchedNotInChannelList = useMemo(() => {
    if (!searchValue) return [];
    return searchUser(notInChannelList, searchValue);
  }, [searchValue, notInChannelList]);

  const renderUser = (user: UserType) => {
    return (
      <ListItemButton key={user.id} sx={{ px: 2.5 }}>
        <UserMentionCard
          userId={userId}
          userMention={user}
          AvatarProps={{ sizes: "36", sx: { mr: 1 } }}
        />
      </ListItemButton>
    );
  };

  const renderAddPeopleItem = () => {
    return (
      <ListItemButton sx={{ px: 2.5 }} onClick={() => dispatch(setOpenAddUserChannelModal(true))}>
        <Box
          m={0.5}
          mr={1.5}
          p={1}
          borderRadius={1}
          color={color.HIGHLIGHT}
          bgcolor={rgba(color.HIGHLIGHT, 0.1)}
        >
          <SlackIcon icon="add-user" />
        </Box>
        <Typography fontWeight={700}>Add people</Typography>
      </ListItemButton>
    );
  };

  if (!selectedChannel) return <></>;

  return (
    <Box flexGrow={1} display="flex" flexDirection="column" bgcolor={color.PRIMARY_BACKGROUND}>
      <Box pt={2} px={3}>
        <TextField
          fullWidth
          type="text"
          color="primary"
          placeholder="Find members"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: -1 }}>
                <SlackIcon icon="search-medium" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" sx={{ mr: -1 }}>
                <IconButton size="small" onClick={() => setSearchValue("")}>
                  <SlackIcon icon="close" />
                </IconButton>
              </InputAdornment>
            ),
            sx: { pl: 1 },
          }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </Box>

      {/* user in channel list */}
      <Box pt={2} bgcolor={color.PRIMARY_BACKGROUND}>
        {!searchValue && renderAddPeopleItem()}

        {!!searchedInChannelList.length && !!searchValue && (
          <Box px={3} pb={0.5}>
            <Typography variant="h5" fontWeight={700} color={color.MAX_SOLID}>
              In this channel
            </Typography>
          </Box>
        )}

        {searchedInChannelList.map(renderUser)}
      </Box>

      {/* user not channel list */}
      {!!searchedNotInChannelList.length && (
        <Box flexGrow={1} bgcolor={color.MIN_SOLID}>
          <Divider />

          <Box px={3} pt={2} pb={0.5}>
            <Typography variant="h5" fontWeight={700} color={color.MAX_SOLID}>
              Not in this channel
            </Typography>
          </Box>

          {searchedNotInChannelList.map(renderUser)}

          {renderAddPeopleItem()}
        </Box>
      )}

      {!searchedInChannelList.length && !searchedNotInChannelList.length && (
        <Box display="flex" flexDirection="column" alignItems="center" py={4}>
          <Typography>No matches found for a</Typography>
          <Button
            variant="outlined"
            size="large"
            sx={{ mt: 2 }}
            onClick={() => dispatch(setOpenAddUserChannelModal(true))}
          >
            Add People
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MemberTab;
