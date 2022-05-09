import { FC, useEffect, useMemo, useRef, useState } from "react";

// redux store
import { useSelector } from "store";

// redux selectors
import * as messagesSelectors from "store/selectors/messages.selector";
import * as usersSelectors from "store/selectors/users.selector";
import * as authSelectors from "store/selectors/auth.selector";

// redux slices
import { UserType } from "store/slices/users.slice";
import { MessageType } from "store/slices/messages.slice";

// components
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

// images
import MessageContent from "./MessageContent";

// utils
import { addNecessaryFields } from "utils/message";
import { dayFormat, isToday, minuteDiff } from "utils/dayjs";
import { color } from "utils/constants";
import SlackIcon from "components/SlackIcon";

interface UserMessageType {
  userOwner?: UserType;
  message: MessageType;
}

const MessageList: FC = () => {
  const messageList = useSelector(messagesSelectors.getMessageList);
  const isLoading = useSelector(messagesSelectors.isLoading);
  const userList = useSelector(usersSelectors.getUserList);
  const user = useSelector(authSelectors.getUser);

  const containerRef = useRef<HTMLDivElement>(null);

  const [anchorJumpMenu, setAnchorJumpMenu] = useState<HTMLButtonElement | null>(null);

  const mappedMessageList = useMemo(() => {
    if (!userList.length || !messageList.length) return [];

    return messageList.map((message) => {
      return {
        ...message,
        isOwner: message.user === user.id,
        delta: addNecessaryFields(message.delta, userList, user.id),
      };
    });
  }, [user, userList, messageList]);

  const userMessagesDayGroup = useMemo(() => {
    if (!mappedMessageList.length) return [];

    const dayGroups: { day: string; minuteGroups: UserMessageType[] }[] = [];

    const minuteGroups: UserMessageType[] = [];
    let curUserId = "";
    let curCreated = 0;

    for (let i = 0; i < mappedMessageList.length; i++) {
      const curMinuteGroup: UserMessageType = { message: mappedMessageList[i] };
      const { user: userId, created } = mappedMessageList[i];

      // add group if message was created after previous message over 5 minutes
      if (userId !== curUserId || minuteDiff(created, curCreated) > 5) {
        curMinuteGroup.userOwner = userList.find((user) => userId === user.id);
      }
      minuteGroups.push(curMinuteGroup);
      curUserId = userId;
      curCreated = created;

      // created to day string
      const createdDay = isToday(created) ? "today" : dayFormat(created, "dddd, MMM Do");
      // check if not same day
      if (dayGroups[dayGroups.length - 1]?.day !== createdDay) {
        dayGroups.push({ day: createdDay, minuteGroups: [] });
      }

      // add minute group to current day group
      dayGroups[dayGroups.length - 1].minuteGroups.push(curMinuteGroup);
    }

    return dayGroups;
  }, [userList, mappedMessageList]);

  // scroll to bottom after messages were loaded
  useEffect(() => {
    if (isLoading || !containerRef.current || !userMessagesDayGroup.length) return;
    containerRef.current.scrollTo({ top: containerRef.current.scrollHeight });
  }, [isLoading, userMessagesDayGroup]);

  if (isLoading) {
    return (
      <Box flex="1" pb={2.5} display="flex" justifyContent="center" alignItems="end">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box ref={containerRef} flex="1" pb={2.5} style={{ overflowY: "auto" }}>
      <List component="div" disablePadding>
        {userMessagesDayGroup.map(({ day, minuteGroups }) => {
          return (
            <Box key={day}>
              <Box position="relative" display="flex" justifyContent="center" my={1}>
                <Box position="absolute" width="100%" top="50%">
                  <Divider />
                </Box>
                <Box
                  position="relative"
                  bgcolor={color.PRIMARY_BACKGROUND}
                  border="1px solid"
                  borderColor={color.BORDER}
                  borderRadius={4}
                  overflow="hidden"
                >
                  <Button
                    sx={{ pl: 1.5 }}
                    // currentTarget is which element is handling onCLick event
                    // in this case, currentTarget is button
                    // Because this event can be trigger byclicking on Button, Typography, SlackIcon
                    // that why we don't use e.target
                    onClick={(e) => setAnchorJumpMenu(e.currentTarget as HTMLButtonElement)}
                  >
                    <Typography variant="h5" fontWeight={700} mr={0.5}>
                      {day}
                    </Typography>
                    <SlackIcon icon="chevron-down" fontSize="medium" />
                  </Button>
                </Box>
              </Box>

              {minuteGroups.map(({ userOwner, message }) => (
                <ListItemButton
                  key={message.id}
                  className="bg-hover-none"
                  sx={{ cursor: "auto", padding: "0" }}
                >
                  <MessageContent userOwner={userOwner} message={message} />
                </ListItemButton>
              ))}
            </Box>
          );
        })}
      </List>

      <Menu
        variant="menu"
        open={!!anchorJumpMenu}
        anchorEl={anchorJumpMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: -4, horizontal: "left" }}
        onClose={() => setAnchorJumpMenu(null)}
      >
        <MenuItem disabled>
          <Typography variant="h5" color={color.HIGH}>
            Jump to...
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => {}}>Today</MenuItem>
        <MenuItem onClick={() => {}}>Yesterday</MenuItem>
        <MenuItem onClick={() => {}}>Last Week</MenuItem>
        <MenuItem onClick={() => {}}>Last Month</MenuItem>
        <MenuItem onClick={() => {}}>The very begining</MenuItem>

        <Divider />

        <MenuItem onClick={() => {}}>Jump to a specific date</MenuItem>
      </Menu>
    </Box>
  );
};

export default MessageList;
