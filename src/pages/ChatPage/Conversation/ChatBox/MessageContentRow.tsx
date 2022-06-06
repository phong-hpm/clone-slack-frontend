import { FC, memo, useCallback, useEffect, useRef, useState } from "react";

// components
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  ListItemButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

// images
import MessageContent from "./MessageContent";
import SlackIcon from "components/SlackIcon";
import MessageContentPanel from "./MessageContentPanel";

// utils
import { color } from "utils/constants";

// types
import { DayMessageType } from "store/slices/_types";

export interface MessageContentRowProps {
  hasMore?: boolean;
  dayMessage?: DayMessageType;
  index: number;
  style: React.CSSProperties;
  setRowHeight: (index: number, clientHeight: number) => void;
}

const MessageContentRow: FC<MessageContentRowProps> = ({
  hasMore,
  dayMessage,
  index,
  style,
  setRowHeight,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  // keepRef.current.height: using for checking the change of content height
  const keepRef = useRef<{ height: number }>({ height: 0 });

  const [anchorJumpMenu, setAnchorJumpMenu] = useState<HTMLButtonElement | null>(null);

  const fireSetHeight = useCallback(
    (height: number) => {
      // if [clientHeight] is 0, that mean it was removed or is loading, don't keep its height
      // fire [setRowHeight] only when clientHeight !== 0 and changed
      if (height && keepRef.current.height !== height) {
        setRowHeight(index, height);
        keepRef.current.height = height;
      }
    },
    [index, setRowHeight]
  );

  useEffect(() => {
    if (rowRef.current) fireSetHeight(rowRef.current.clientHeight);
  }, [fireSetHeight, rowRef]);

  // observer changing row's height, fire [setRowHeight] to re compute virtual list
  // Ex: edit message, children will render MessageInput
  //     -> height will be changed
  useEffect(() => {
    const element = rowRef.current!;

    const observer = new ResizeObserver((entries) => {
      fireSetHeight(entries[0].target.clientHeight);
    });

    observer.observe(element);
  }, [index, fireSetHeight]);

  return (
    <>
      <Box style={{ ...style, transform: "rotateX(180deg)" }}>
        <Box ref={rowRef}>
          {!dayMessage && (
            <Box>
              {hasMore ? (
                <Box p={3} textAlign="center">
                  <CircularProgress />
                </Box>
              ) : (
                <MessageContentPanel />
              )}
            </Box>
          )}

          {dayMessage?.day && (
            <Box
              key={dayMessage.day}
              position="relative"
              display="flex"
              justifyContent="center"
              py={1}
            >
              <Box position="absolute" width="100%" top="50%">
                <Divider />
              </Box>
              <Box position="relative" bgcolor={color.PRIMARY_BACKGROUND}>
                <Button
                  sx={{ pl: 1.5, border: `1px solid ${color.BORDER}`, borderRadius: 4 }}
                  // currentTarget is which element is handling onCLick event
                  // in this case, currentTarget is button
                  // Because this event can be trigger by clicking on Button, Typography, SlackIcon
                  // that why we don't use e.target
                  onClick={(e) => setAnchorJumpMenu(e.currentTarget as HTMLButtonElement)}
                >
                  <Typography variant="h5" fontWeight={700} mr={0.5}>
                    {dayMessage.day}
                  </Typography>
                  <SlackIcon icon="chevron-down" fontSize="medium" />
                </Button>
              </Box>
            </Box>
          )}

          {dayMessage?.message && (
            <ListItemButton
              key={dayMessage.message.id}
              className="bg-hover-none"
              sx={{ cursor: "auto", padding: "0" }}
            >
              <MessageContent userOwner={dayMessage.userOwner} message={dayMessage.message} />
            </ListItemButton>
          )}
        </Box>
      </Box>

      {!!anchorJumpMenu && (
        <Menu
          variant="menu"
          open={true}
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
      )}
    </>
  );
};

export default memo(MessageContentRow);
