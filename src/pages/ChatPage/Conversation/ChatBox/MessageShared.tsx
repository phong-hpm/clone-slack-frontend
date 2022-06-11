import { FC } from "react";

// redux store
import { useSelector } from "store";

// redux selector
import channelUsersSelectors from "store/selectors/channelUsers.selector";

// components
import { Box } from "@mui/material";
import MessageContent from "./MessageContent";

// utils
import { color } from "utils/constants";

// types
import { MessageType, UserType } from "store/slices/_types";

export interface MessageSharedProps {
  isPreventSharedMessage?: boolean;
  isMessageOnly?: boolean;
  isHideMessageTime?: boolean;
  lineColor?: string;
  message: MessageType;
  userOwner?: UserType;
}

const MessageShared: FC<MessageSharedProps> = ({
  isPreventSharedMessage,
  isMessageOnly,
  isHideMessageTime,
  lineColor,
  message,
  userOwner: userOwnerProp,
}) => {
  const userOwner = useSelector((state) =>
    channelUsersSelectors.getChannelUserById(state, message.user)
  );

  return (
    <Box position="relative" px={2}>
      <Box
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        width={4}
        borderRadius={4}
        bgcolor={lineColor || color.PRIMARY}
      />
      <MessageContent
        isReadOnly
        isPreventSharedMessage={isPreventSharedMessage}
        isMessageOnly={isMessageOnly}
        isHideMessageTime={isHideMessageTime}
        message={message}
        userOwner={userOwnerProp || userOwner}
      />
    </Box>
  );
};

export default MessageShared;
