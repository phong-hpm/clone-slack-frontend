import { FC } from "react";

// redux store
import { useSelector } from "store";

// redux selector
import userSelectors from "store/selectors/user.selector";

// components
import { Box, IconButton, Tooltip } from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import { color } from "utils/constants";
import UserAvatarStatus from "components/UserAvatarStatus";

const ChatBar: FC = () => {
  const user = useSelector(userSelectors.getUser);

  return (
    <Box
      display="flex"
      py={1.125}
      bgcolor="rgba(18, 16, 22, 1)"
      borderBottom={1}
      borderColor={color.BORDER}
    >
      <Box flexBasis={220} display="flex" justifyContent="flex-end" alignItems="center" px={2.5}>
        <Tooltip placement="bottom" title="History">
          <IconButton sx={{ borderRadius: 1 }}>
            <SlackIcon fontSize="large" icon="clock" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box flex="1" display="flex">
        <div style={{ background: "#ccc", height: "26px", width: "100%" }}></div>
      </Box>
      <Box flexBasis={230} display="flex" justifyContent="flex-end" alignItems="center" px={2}>
        <Tooltip placement="bottom" title="Help">
          <IconButton sx={{ borderRadius: 1 }}>
            <SlackIcon fontSize="large" icon="help" />
          </IconButton>
        </Tooltip>
        <Box ml={2}>
          <Tooltip placement="bottom" title={user.name}>
            <IconButton sx={{ borderRadius: 1, p: 0 }}>
              <UserAvatarStatus sizes="medium" src={user.avatar} isOnline={true} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBar;
