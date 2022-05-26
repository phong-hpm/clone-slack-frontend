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
}

const UserAvatarStatus: FC<UserAvatarStatusProps> = ({ isOnline, ...props }) => {
  return (
    <Box position="relative">
      <Box position="relative" overflow="hidden">
        <Box
          position="absolute"
          zIndex={1}
          right={-4}
          bottom={-3}
          width={11}
          height={11}
          borderRadius={5}
          bgcolor={color.BG_WORK_SPACE}
        />
        <Avatar {...props}>
          <img src={defaultAvatar} alt="" />
        </Avatar>
      </Box>
      <Box position="absolute" zIndex={2} right={-6} bottom={-5}>
        <Status isOnline={isOnline} fontSize="medium" />
      </Box>
    </Box>
  );
};

export default UserAvatarStatus;
