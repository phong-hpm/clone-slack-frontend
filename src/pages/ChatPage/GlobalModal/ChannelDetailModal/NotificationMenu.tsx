import { FC } from "react";

// redux store
import { useDispatch, useSelector } from "store";

// redux selector
import channelsSelectors from "store/selectors/channels.selector";

// redux actions
import {
  emitEditChannelOptionalFields,
  emitEditChannelMute,
} from "store/actions/socket/channelSocket.action";

// components
import { Box, Divider, Menu, MenuItem, MenuProps, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import { color } from "utils/constants";

// types
import { ChannelType } from "store/slices/_types";

export interface NotificationMenuProps extends MenuProps {}

const NotificationMenu: FC<NotificationMenuProps> = ({ onClose, ...props }) => {
  const dispatch = useDispatch();

  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  if (!selectedChannel) return <></>;

  const mainList = [
    {
      show: !selectedChannel.isMuted,
      val: "all",
      title: "All messages",
      desc: "Get notifications for all messages",
    },
    {
      show: !selectedChannel.isMuted,
      val: "mention",
      title: "@ Mentions",
      desc: "Get notifications for @mentions, @here and @channel only",
    },
    {
      show: !selectedChannel.isMuted,
      val: "off",
      title: "Off",
      desc: "You won't get notifications",
    },
    {
      show: !selectedChannel.isMuted,
      val: "",
      title: "",
      desc: "",
    }, // divider
    {
      show: true,
      val: "mute",
      title: `${selectedChannel.isMuted ? "Unmute" : "Mute"} channel`,
      desc: selectedChannel.isMuted
        ? ""
        : "Move this channel to the bottom and only see a badge if you're mentioned",
    },
  ];

  const displayList = mainList.filter(({ show }) => show);

  return (
    <Menu
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: -4, horizontal: "left" }}
      style={{ zIndex: 1500 }}
      PaperProps={{ sx: { width: 300 } }}
      onClose={onClose}
      {...props}
    >
      {displayList.map(({ val, title, desc, show }, index) => {
        const isSelected = val === selectedChannel.notification;

        if (!val) return <Divider key={index} />;

        return (
          <MenuItem
            key={index}
            sx={{ py: 0.5 }}
            onClick={() => {
              if (val === "mute") {
                dispatch(
                  emitEditChannelMute({ id: selectedChannel.id, isMuted: !selectedChannel.isMuted })
                );
              } else {
                dispatch(
                  emitEditChannelOptionalFields({
                    id: selectedChannel.id,
                    notification: val as unknown as ChannelType["notification"],
                  })
                );
              }
              onClose?.({}, "backdropClick");
            }}
          >
            <Box>
              {isSelected && !selectedChannel.isMuted ? (
                <Box position="relative" color={color.HIGHLIGHT}>
                  <SlackIcon
                    icon="check-small"
                    fontSize="medium"
                    style={{ position: "absolute", top: 2, left: -18 }}
                  />
                  <Typography>{title}</Typography>
                </Box>
              ) : (
                <Typography>{title}</Typography>
              )}

              <Typography variant="h5" color={color.HIGH} mt={0.5}>
                {desc}
              </Typography>
            </Box>
          </MenuItem>
        );
      })}

      <Divider />

      <MenuItem sx={{ py: 1 }}>
        <Typography>More notification options</Typography>
      </MenuItem>
    </Menu>
  );
};

export default NotificationMenu;
