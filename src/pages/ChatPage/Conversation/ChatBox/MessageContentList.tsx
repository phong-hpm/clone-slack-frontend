import { FC, useEffect, useRef, useState } from "react";

// redux store
import { useSelector } from "store";

// redux selectors
import * as messagesSelectors from "store/selectors/messages.selector";
import * as channelsSelectors from "store/selectors/channels.selector";

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

// hooks
import useFireOnce from "hooks/useFireOnce";

// images
import MessageContent from "./MessageContent";

// utils
import { color } from "utils/constants";
import SlackIcon from "components/SlackIcon";

const MessageContentList: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { fireOnce } = useFireOnce();

  const [scrolled, setScrolled] = useState(false);
  const isLoading = useSelector(messagesSelectors.isLoading);
  // messages in [userMessagesDayGroup] were have the same reference with it's previous reference
  //    only updated message's reference was changed
  // If update [userMessagesDayGroup], we MUST NOT to create new message's reference on it
  const userMessagesDayGroup = useSelector(messagesSelectors.getGroupedMessageList);
  const unreadMessageCount = useSelector(channelsSelectors.getUnreadMessageCount);

  const [anchorJumpMenu, setAnchorJumpMenu] = useState<HTMLButtonElement | null>(null);

  // scroll to bottom after messages were loaded
  useEffect(() => {
    if (isLoading || !userMessagesDayGroup.length) return;
    let timeoutId: NodeJS.Timer;
    if (!scrolled || unreadMessageCount) {
      // waiting for [MessageContent] render data
      timeoutId = setTimeout(() => {
        // using [fireOnce] to prevent scroll after [messages] updated
        // fireOnce(() => {
        containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight });
        setScrolled(true);
        // });
      }, 1);
    }

    return () => clearTimeout(timeoutId!);
  }, [scrolled, isLoading, fireOnce, unreadMessageCount, userMessagesDayGroup]);

  if (isLoading) {
    return (
      <Box flex="1" pb={2.5} display="flex" justifyContent="center" alignItems="end">
        <CircularProgress />
      </Box>
    );
  }

  if (!userMessagesDayGroup.length) return <></>;

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

              {minuteGroups.map(({ userOwner, message, isStartUnreadMessage }, index) => {
                return (
                  <ListItemButton
                    key={message.id}
                    className="bg-hover-none"
                    sx={{
                      cursor: "auto",
                      padding: "0",
                      border: isStartUnreadMessage ? `1px solid ${color.DANGER}` : undefined,
                    }}
                  >
                    <MessageContent userOwner={userOwner} message={message} />
                  </ListItemButton>
                );
              })}
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

export default MessageContentList;
