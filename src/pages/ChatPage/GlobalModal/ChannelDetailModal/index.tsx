import { useState } from "react";

// redux store
import { useDispatch, useSelector } from "store";

// redux actions
import { emitEditChannelOptionalFields } from "store/actions/socket/channelSocket.action";

// redux slices
import { setOpenChannelDetailModal } from "store/slices/globalModal.slice";

// redux selectors
import globalModalSelectors from "store/selectors/globalModal.selector";
import channelsSelectors from "store/selectors/channels.selector";

// components
import { Box, Typography, Tabs, Tab, Button, Tooltip } from "@mui/material";
import { Modal, ModalHeader, ModalBody } from "components/Modal";
import SlackIcon from "components/SlackIcon";
import AboutTab from "./AboutTab";
import MemberTab from "./MemberTab";
import IntergrationTab from "./IntergrationTab";
import SettingTab from "./SettingTab";
import NotificationMenu from "./NotificationMenu";

// utils
import { color } from "utils/constants";

const AddUserChannelChannel = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(globalModalSelectors.isOpenChannelDetail);
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  const [tabValue, setTabValue] = useState("about");
  const [notificationAnchor, setNotificationAnchor] = useState<HTMLButtonElement | null>(null);

  const handleClose = () => {
    dispatch(setOpenChannelDetailModal(false));
  };

  if (!selectedChannel) return <></>;

  const tabList =
    selectedChannel.type === "direct_message"
      ? ["about", "integrations"]
      : ["about", "members", "integrations", "settings"];

  let notificationTooltip = "You will be notified about all messages sent to this channel";
  let notificationLabel = "Get Notifications for All Messages";
  if (selectedChannel.notification === "mention") {
    notificationLabel = "Get notifications for @ Mentions";
    notificationTooltip = "You will be notified when you're mentioned in this channel";
  }
  if (selectedChannel.notification === "off") {
    notificationLabel = "Notifications Off";
    notificationTooltip = "You won't get notifications about this channel";
  }

  return (
    <Modal
      isOpen={isOpen}
      isCloseBtn
      onClose={handleClose}
      IconCloseProps={{ top: 20, right: 20 }}
      style={{ content: { maxWidth: 600, minHeight: "85vh" } }}
    >
      <ModalHeader minHeight="auto" isBorder pb={0}>
        <Box>
          <Typography variant="h3">
            <SlackIcon icon="hash-medium-bold" style={{ fontSize: 22 }} />
            {selectedChannel?.name}
          </Typography>

          {/* actions */}
          <Box display="flex" mt={1.5}>
            <Tooltip title="Star channel">
              <Button
                variant="outlined"
                size="medium"
                onClick={() =>
                  dispatch(
                    emitEditChannelOptionalFields({
                      id: selectedChannel.id,
                      isStarred: !selectedChannel.isStarred,
                    })
                  )
                }
              >
                <SlackIcon
                  icon={selectedChannel.isStarred ? "star" : "star-o"}
                  fontSize="medium"
                  style={{ color: selectedChannel.isStarred ? color.HIGHLIGHT : undefined }}
                />
              </Button>
            </Tooltip>

            <Tooltip title={notificationTooltip}>
              <Button
                variant="outlined"
                size="medium"
                sx={{ ml: 1 }}
                onClick={(event) => setNotificationAnchor(event.currentTarget as HTMLButtonElement)}
              >
                <SlackIcon icon="bell-o" fontSize="medium" />
                <Typography variant="h5" mx={1} fontWeight={700} lineHeight="15px">
                  {notificationLabel}
                </Typography>
                <SlackIcon icon="chevron-medium-down" fontSize="medium" />
              </Button>
            </Tooltip>

            <Tooltip title="To start a call in a channel, check out our paid plans">
              <Box>
                <Button variant="contained" size="medium" disabled sx={{ ml: 1, borderWidth: 0 }}>
                  <SlackIcon icon="phone" fontSize="medium" />
                  <Typography variant="h5" ml={1}>
                    Start a Call
                  </Typography>
                </Button>
              </Box>
            </Tooltip>
          </Box>

          {/* Tabs */}
          <Box mt={1.5}>
            <Tabs
              value={tabValue}
              sx={{ minHeight: "auto" }}
              onChange={(_, value) => setTabValue(value)}
            >
              {tabList.map((tab) => {
                let label = tab;
                if (tab === "members") label = `Members ${selectedChannel.users.length}`;
                return (
                  <Tab
                    key={tab}
                    label={label}
                    value={tab}
                    sx={{ mr: 4, px: 0, py: 1, fontSize: 13, textTransform: "capitalize" }}
                    style={{
                      fontWeight: 700,
                      minWidth: "auto",
                      minHeight: "auto",
                      color: tabValue === tab ? "inherit" : color.MAX_SOLID,
                    }}
                    TouchRippleProps={{ style: { display: "none" } }}
                  />
                );
              })}
            </Tabs>
          </Box>
        </Box>
      </ModalHeader>

      <ModalBody display="flex" p={0} bgcolor={color.MIN_SOLID}>
        {tabValue === "about" && <AboutTab />}
        {tabValue === "members" && <MemberTab />}
        {tabValue === "integrations" && <IntergrationTab />}
        {tabValue === "settings" && <SettingTab />}
      </ModalBody>

      {notificationAnchor && (
        <NotificationMenu
          open={true}
          anchorEl={notificationAnchor}
          onClose={() => setNotificationAnchor(null)}
        />
      )}
    </Modal>
  );
};

export default AddUserChannelChannel;
