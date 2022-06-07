import { FC } from "react";

// components
import { Box, Avatar, AvatarProps } from "@mui/material";
import Status from "components/Status";

// images
import defaultAvatar from "assets/images/default_avatar.png";

// utils
import { color } from "utils/constants";

export interface UserAvatarStatusProps extends AvatarProps {
  isOnline?: boolean;
  statusSize?: "small" | "medium" | "large";
}

const UserAvatarStatus: FC<UserAvatarStatusProps> = ({ isOnline, statusSize, sizes, ...props }) => {
  let statusBackSize = 11;
  let statusFontSize = 15;

  if (sizes === "medium") {
    statusBackSize = 14;
    statusFontSize = 18;
  }

  if (sizes === "large") {
    statusBackSize = 15;
    statusFontSize = 22;
  }

  return (
    <Box position="relative">
      <Box position="relative" overflow="hidden">
        <Box
          position="absolute"
          zIndex={1}
          right={-(statusBackSize / 2.5)}
          bottom={-(statusBackSize / 3)}
          width={statusBackSize}
          height={statusBackSize}
          borderRadius={5}
          bgcolor={color.BG_WORK_SPACE}
        />
        <Avatar sizes={sizes} {...props}>
          <img src={defaultAvatar} alt="" />
        </Avatar>
      </Box>
      <Box
        position="absolute"
        zIndex={2}
        right={-(statusFontSize / 2.5)}
        bottom={-(statusFontSize / 3)}
      >
        <Status isOnline={isOnline} style={{ fontSize: statusFontSize }} />
      </Box>
    </Box>
  );
};

export default UserAvatarStatus;
