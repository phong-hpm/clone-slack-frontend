import { FC } from "react";

// images
import defaultAvatar from "assets/images/default_avatar.png";

// redux slice
import { UserType } from "store/slices/users.slice";

// components
import { Avatar, Box, Typography } from "@mui/material";
import Status from "components/Status";

export interface MentionItemProps {
  userId: string;
  userMention: UserType;
}

const MentionItem: FC<MentionItemProps> = ({ userId, userMention }) => {
  return (
    <Box className="mention-item">
      <Box p={0.5}>
        <Avatar sizes="small" src={defaultAvatar} />
      </Box>
      <Box p={0.5}>
        <Typography fontWeight={700}>{userMention.name || "unknow"}</Typography>
      </Box>
      {userMention.id === userId && (
        <Box p={0.5} pl={0}>
          <Typography fontWeight={700}>(you)</Typography>
        </Box>
      )}
      <Box p={0.5}>
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

export default MentionItem;
