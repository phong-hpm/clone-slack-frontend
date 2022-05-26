import { FC } from "react";

// redux store
import { useSelector } from "store";

// redux selector
import * as authSelectors from "store/selectors/auth.selector";

// images
import defaultAvatar from "assets/images/default_avatar.png";

// components
import { Box, Avatar } from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import { color } from "utils/constants";

const ChatBar: FC = () => {
  const user = useSelector(authSelectors.getUser);

  return (
    <Box
      display="flex"
      py={1.125}
      bgcolor="rgba(18, 16, 22, 1)"
      borderBottom={1}
      borderColor={color.BORDER}
    >
      <Box flexBasis={220} display="flex" justifyContent="flex-end" alignItems="center" px={2.5}>
        <SlackIcon fontSize="large" icon="clock" />
      </Box>
      <Box flex="1" display="flex">
        <div style={{ background: "#ccc", height: "26px", width: "100%" }}></div>
      </Box>
      <Box flexBasis={230} display="flex" justifyContent="flex-end" alignItems="center" px={2}>
        <SlackIcon fontSize="large" icon="help" />
        <Box ml={2}>
          <Avatar sizes="medium" src={user.avatar}>
            <img src={defaultAvatar} alt="" />
          </Avatar>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBar;
