import { FC, useEffect, useState } from "react";

// redux store
import { useSelector } from "store";

// redux selector
import * as authSelectors from "store/selectors/auth.selector";
import * as usersSelectors from "store/selectors/users.selector";
import * as channelsSelectors from "store/selectors/channels.selector";

// components
import { Box, Button, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import UserAvatarStatus from "components/UserAvatarStatus";

// utils
import { color } from "utils/constants";
import { UserType } from "store/slices/_types";

const ConversationHeader: FC = () => {
  const loggedUserId = useSelector(authSelectors.getUserId);
  const userList = useSelector(usersSelectors.getUserList);
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  const [partner, setPartner] = useState<UserType | undefined>();

  useEffect(() => {
    if (selectedChannel?.type === "direct_message") {
      const partnerId = selectedChannel.users.find((id) => id !== loggedUserId);

      let partner: UserType | undefined;
      if (partnerId) partner = userList.find(({ id }) => id === partnerId);
      if (partner) setPartner(partner);
    }
  }, [loggedUserId, userList, selectedChannel]);

  return (
    <Box px={0.5} py={1} borderBottom={1} color={color.PRIMARY} borderColor={color.BORDER}>
      <Button variant="text" size="small" sx={{ p: 0.5 }}>
        {selectedChannel?.type === "direct_message" ? (
          <Box mr={0.5}>
            <UserAvatarStatus sizes="medium" src={partner?.avatar} isOnline={partner?.isOnline} />
          </Box>
        ) : (
          <SlackIcon icon="hash-medium-bold" />
        )}
        <Typography pl={0.5} variant="h4" textAlign="left">
          {selectedChannel?.name || ""}
        </Typography>
        {selectedChannel && <SlackIcon icon="chevron-down" />}
      </Button>
    </Box>
  );
};

export default ConversationHeader;
