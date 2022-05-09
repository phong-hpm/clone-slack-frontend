import { FC } from "react";

// redux store
import { useSelector } from "../../../store";

// redux selector
import * as channelsSelectors from "../../../store/selectors/channels.selector";

// components
import { Box } from "@mui/system";

// components
import { Avatar, Button, Typography } from "@mui/material";
import SlackIcon from "../../../components/SlackIcon";

// images
import defaultAvatar from "../../../assets/images/default_avatar.png";

// utils
import { color } from "../../../utils/constants";

const ConversationHeader: FC = () => {
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  return (
    <Box px={0.5} py={1} borderBottom={1} color={color.PRIMARY} borderColor={color.BORDER}>
      <Button variant="text" size="small">
        <Typography mx={0.25} variant="h4" textAlign="left">
          {selectedChannel?.type === "direct_message" ? (
            <Avatar sizes="medium" src={defaultAvatar} />
          ) : (
            <SlackIcon icon="hash-medium-bold" />
          )}
          {selectedChannel?.name || ""}
        </Typography>
        {selectedChannel && <SlackIcon icon="chevron-down" />}
      </Button>
    </Box>
  );
};

export default ConversationHeader;
