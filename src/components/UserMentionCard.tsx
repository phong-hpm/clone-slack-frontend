import { FC } from "react";

// images
import defaultAvatar from "assets/images/default_avatar.png";

// components
import { Avatar, AvatarProps, Box, BoxProps, Typography } from "@mui/material";
import Status from "components/Status";

// types
import { UserType } from "store/slices/_types";
import { color } from "utils/constants";

export interface UserMentionCardProps extends BoxProps {
  userId: string;
  userMention?: UserType;
  avatarElement?: JSX.Element;
  AvatarProps?: AvatarProps;
}

const UserMentionCard: FC<UserMentionCardProps> = ({
  userId,
  userMention,
  avatarElement,
  AvatarProps,
  ...props
}) => {
  if (!userMention) return <></>;

  return (
    <Box display="flex" alignItems="center" color={color.PRIMARY} {...props}>
      <Box p={0.5}>
        {avatarElement || (
          <Avatar sizes="small" src={userMention.avatar} {...AvatarProps}>
            <img src={defaultAvatar} alt="" />
          </Avatar>
        )}
      </Box>
      <Box p={0.5}>
        <Typography fontWeight={700}>{userMention.name || "unknow"}</Typography>
      </Box>
      {userMention.id === userId && (
        <Box p={0.5} pl={0}>
          <Typography fontWeight={700}>(you)</Typography>
        </Box>
      )}
      <Box>
        <Status isOnline={userMention.isOnline} fontSize="large" />
      </Box>
      {!!userMention.realname && (
        <Box p={0.5}>
          <Typography>{userMention.realname}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default UserMentionCard;
