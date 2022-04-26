import { FC } from "react";

// redux store
import { useSelector } from "../../../store";

// redux selector
import * as channelsSelectors from "../../../store/selectors/channels.selector";

// components
import { Box } from "@mui/system";

// icons
import { KeyboardArrowDown as KeyboardArrowDownIcon, Tag as TagIcon } from "@mui/icons-material";

// images
import defaultAvatar from "../../../assets/images/default_avatar.png";

// components
import { Avatar, Button, Typography } from "@mui/material";

const ConversationHeader: FC = () => {
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  if (!selectedChannel) return <></>;

  return (
    <Box px={0.5} py={1} borderBottom={1} borderColor="rgba(209, 210, 211, 0.1)">
      <Button size="small" variant="outlined" color="primary">
        {selectedChannel.id[0] === "C" ? (
          <TagIcon fontSize="inherit" />
        ) : (
          <Avatar src={defaultAvatar} />
        )}
        <Typography mx={0.5} variant="h4">
          {selectedChannel.name}
        </Typography>
        <KeyboardArrowDownIcon fontSize="small" />
      </Button>
    </Box>
  );
};

export default ConversationHeader;
