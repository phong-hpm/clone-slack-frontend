import { FC } from "react";

// redux store
import { useSelector } from "../../../store";

// redux selector
import * as channelsSelectors from "../../../store/selectors/channels.selector";

// components
import { Box } from "@mui/system";

// images
import defaultAvatar from "../../../assets/images/default_avatar.png";

// components
import { Avatar, Button, Typography } from "@mui/material";
import SlackIcon from "../../../components/SlackIcon";

const ConversationHeader: FC = () => {
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  if (!selectedChannel) return <></>;

  return (
    <Box px={0.5} py={1} borderBottom={1} borderColor="rgba(209, 210, 211, 0.1)">
      <Button size="small" variant="outlined" color="primary">
        {selectedChannel.type === "dirrectMessage" ? (
          <SlackIcon icon="hash-medium-bold" />
        ) : (
          <Avatar src={defaultAvatar} />
        )}
        <Typography mx={0.25} variant="h4">
          {selectedChannel.name}
        </Typography>
        <SlackIcon icon="chevron-down" />
      </Button>
    </Box>
  );
};

export default ConversationHeader;
