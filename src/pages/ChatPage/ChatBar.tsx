import { FC } from "react";

// images
import defaultAvatar from "../../assets/images/default_avatar.png";

// components
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";

const ChatBar: FC = () => {
  return (
    <Box
      display="flex"
      px={2}
      py={1.125}
      bgcolor="rgba(18, 16, 22, 1)"
      borderBottom={1}
      borderColor="rgba(209, 210, 211, 0.1)"
    >
      <Box flexBasis={260}></Box>
      <Box flex="1">search</Box>
      <Box>
        <Avatar src={defaultAvatar} />
      </Box>
    </Box>
  );
};

export default ChatBar;
