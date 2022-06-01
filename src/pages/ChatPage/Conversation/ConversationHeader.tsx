import { FC, useMemo, useState } from "react";

// images
import defaultAvatar from "assets/images/default_avatar.png";

// redux store
import { useSelector } from "store";

// redux selector
import userSelectors from "store/selectors/user.selector";
import channelUsersSelectors from "store/selectors/channelUsers.selector";
import channelsSelectors from "store/selectors/channels.selector";

// components
import { Avatar, Box, Button, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import UserAvatarStatus from "components/UserAvatarStatus";

// utils
import { color } from "utils/constants";

const ConversationHeader: FC = () => {
  const user = useSelector(userSelectors.getUser);
  const channelUserList = useSelector(channelUsersSelectors.getChannelUserList);
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  const [isHovering, setHovering] = useState(false);

  // set [user] in the last of list
  const reOrderUserList = useMemo(() => {
    const list = channelUserList.filter((channelUser) => channelUser.id !== user.id);
    list.push(user);
    return list;
  }, [user, channelUserList]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      px={2}
      py={1}
      borderBottom={1}
      color={color.PRIMARY}
      borderColor={color.BORDER}
    >
      <Button variant="text" size="small" sx={{ p: 0.5 }}>
        {selectedChannel?.partner ? (
          <Box mr={0.5}>
            <UserAvatarStatus
              sizes="medium"
              src={selectedChannel.partner.avatar}
              isOnline={selectedChannel.partner.isOnline}
            />
          </Box>
        ) : (
          <SlackIcon icon="hash-medium-bold" />
        )}
        <Typography pl={0.5} variant="h4" textAlign="left">
          {selectedChannel?.name || ""}
        </Typography>
        {selectedChannel && <SlackIcon icon="chevron-down" />}
      </Button>

      <Button
        variant="outlined"
        sx={{ height: 30, p: 0.375, borderRadius: 1, borderColor: color.BORDER }}
        onMouseOver={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <Box display="flex" alignItems="center">
          <Box display="flex" flexDirection="row-reverse">
            {reOrderUserList.map((user) => {
              return (
                <Box key={user.id} mr={-0.5}>
                  <Avatar
                    src={user.avatar}
                    sx={{
                      width: 22,
                      height: 22,
                      boxShadow: `0px 0px 0px 2px ${
                        isHovering ? color.MIN_SOLID : color.PRIMARY_BACKGROUND
                      }`,
                    }}
                  >
                    <img src={defaultAvatar} alt="" />
                  </Avatar>
                </Box>
              );
            })}
          </Box>
          <Typography variant="h5" color={color.HIGH} sx={{ ml: 1.5, mr: 0.75 }}>
            {reOrderUserList.length}
          </Typography>
        </Box>
      </Button>
    </Box>
  );
};

export default ConversationHeader;
