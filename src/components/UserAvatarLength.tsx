import { FC } from "react";

// components
import { Box, Avatar, AvatarProps, Typography } from "@mui/material";

// images
import defaultAvatar from "assets/images/default_avatar.png";

// utils
import { rgba, color } from "utils/constants";

export interface UserAvatarLengthProps extends AvatarProps {
  length: number;
}

const UserAvatarLength: FC<UserAvatarLengthProps> = ({ length, ...props }) => {
  return (
    <Box position="relative" width={20} height={20}>
      <Avatar sizes="14" {...props}>
        <img src={defaultAvatar} alt="" />
      </Avatar>
      <Box
        position="absolute"
        top={8}
        left={8}
        width={14}
        height={14}
        borderRadius={1}
        bgcolor={color.BG_WORK_SPACE}
      >
        <Typography
          fontSize={11}
          lineHeight="14px"
          fontWeight={700}
          textAlign="center"
          bgcolor={rgba(color.PRIMARY, 0.1)}
          borderRadius={1}
        >
          {/* don't count logged user */}
          {length}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserAvatarLength;
