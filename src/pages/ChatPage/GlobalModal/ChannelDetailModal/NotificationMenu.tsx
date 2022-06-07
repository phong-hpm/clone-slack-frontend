import { FC } from "react";

// redux store
import { useDispatch, useSelector } from "store";

// redux selector
import channelsSelectors from "store/selectors/channels.selector";

// components
import { Box, Divider, Menu, MenuItem, MenuProps, Typography } from "@mui/material";

// utils
import { color } from "utils/constants";
import SlackIcon from "components/SlackIcon";
import { emitEditChannelOptionalFields } from "store/actions/socket/channelSocket.action";
import { ChannelType } from "store/slices/_types";

export interface NotificationMenuProps extends MenuProps {}

const NotificationMenu: FC<NotificationMenuProps> = ({ onClose, ...props }) => {
  const dispatch = useDispatch();

  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  if (!selectedChannel) return <></>;

  const mainList = [
    { val: "all", title: "All messages", desc: "Get notifications for all messages" },
    {
      val: "mention",
      title: "@ Mentions",
      desc: "Get notifications for @mentions, @here and @channel only",
    },
    { val: "off", title: "Off", desc: "You won't get notifications" },
    { val: "", title: "", desc: "" }, // divider
    {
      val: "muted",
      title: "Mute channel",
      desc: "Move this channel to the bottom and only see a badge if you're mentioned",
    },
  ];

  return (
    <Menu
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: -4, horizontal: "left" }}
      style={{ zIndex: 1500 }}
      PaperProps={{ sx: { width: 300 } }}
      onClose={onClose}
      {...props}
    >
      {mainList.map(({ val, title, desc }, index) => {
        const isSelected = val === selectedChannel.notification;

        if (!val) return <Divider key={index} />;

        return (
          <MenuItem
            key={index}
            sx={{ py: 1 }}
            onClick={() => {
              dispatch(
                emitEditChannelOptionalFields({
                  id: selectedChannel.id,
                  notification: val as unknown as ChannelType["notification"],
                })
              );
              onClose?.({}, "backdropClick");
            }}
          >
            <Box>
              {!isSelected && <Typography>{title}</Typography>}
              {isSelected && (
                <Box position="relative" color={color.HIGHLIGHT}>
                  <SlackIcon
                    icon="check-small"
                    fontSize="medium"
                    style={{ position: "absolute", top: 2, left: -18 }}
                  />
                  <Typography>{title}</Typography>
                </Box>
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
