import { FC, useRef, useState, useContext } from "react";

// images
import defaultAvatar from "assets/images/default_avatar.png";

// components
import { Avatar, Box, Link, Tab, Tabs, Typography } from "@mui/material";
import { Modal, ModalBody, ModalProps } from "components/Modal";
import TimeCard from "components/TimeCard";
import UserNameCard from "components/UserNameCard";

// context
import { VideoPlayerContext } from "./VideoPlayerContext";

// utils
import { dayFromNow } from "utils/dayjs";
import { buildProgressTime } from "utils/waveSurver";

// constants
import { color, rgba } from "utils/constants";

// types
import { PlayerBaseInstance } from "./_types";

export interface FullScreenModalProps extends Omit<ModalProps, "isOpen" | "onAfterOpen"> {
  onAfterOpen?: (El: HTMLDivElement | null) => void;
  playerInstance: PlayerBaseInstance;
}

const FullScreenModal: FC<FullScreenModalProps> = ({
  playerInstance,
  onAfterOpen,
  onClose,
  ...props
}) => {
  const { state, updateState } = useContext(VideoPlayerContext);

  const containerRef = useRef<HTMLDivElement>(null);
  const [tabValue, setTabValue] = useState<"thread" | "transcript">("transcript");

  const computeVideoSize = (containerEl: HTMLDivElement) => {
    if (!playerInstance.video.videoEl || !containerRef.current) return;
    const { width: containerWidth, height: containerHeight } = containerEl.getBoundingClientRect();
    playerInstance.video.videoEl.style.maxWidth = `${containerWidth}px`;
    playerInstance.video.videoEl.style.maxHeight = `${containerHeight}px`;
    playerInstance.video.videoEl.style.opacity = `1`;
  };

  const handleAfterOpen = () => {
    onAfterOpen && onAfterOpen(containerRef.current);

    if (containerRef.current) {
      // useing appendChild will help [video] can play continously
      if (playerInstance.video.containerEl) {
        containerRef.current.appendChild(playerInstance.video.containerEl);
      }

      const containerEl = containerRef.current;
      computeVideoSize(containerEl);
      const observer = new ResizeObserver(() => {
        computeVideoSize(containerEl);
      });
      observer.observe(containerEl);
    }
  };

  const handleClose = () => {
    onClose();
    updateState({ isFullScreen: false });
  };

  const handleAfterClose = () => {
    if (playerInstance.containerEl && playerInstance.video.containerEl) {
      playerInstance.containerEl.append(playerInstance.video.containerEl);
    }
  };

  const handleChangeProgressSlider = (value: number) => {
    if (playerInstance.video.videoEl) playerInstance.video.videoEl.currentTime = value;
  };

  return (
    <Modal
      className="modal-full"
      isOpen={state.isFullScreen}
      isCloseBtn
      onAfterOpen={handleAfterOpen}
      onAfterClose={handleAfterClose}
      onClose={handleClose}
      {...props}
    >
      <ModalBody height="100%" p={0} overflow="hidden">
        <Box display="flex" height="100%">
          <Box
            position="relative"
            ref={containerRef}
            flex="1"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor={rgba(color.DARK, 0.5)}
          >
            <Box
              position="absolute"
              zIndex="600"
              display="flex"
              top={0}
              left={0}
              right={0}
              p={2}
              sx={{
                backgroundImage: `linear-gradient(
                  ${rgba(color.SECONDARY_BACKGROUND, 0.6)},
                  ${rgba(color.SECONDARY_BACKGROUND, 0)}
                )`,
              }}
            >
              <Box flexBasis={36} mr={1}>
                <Avatar src={state.userOwner?.avatar}>
                  <img src={defaultAvatar} alt="" />
                </Avatar>
              </Box>

              <Box flex="1" display="flex">
                <Box display="flex" flexDirection="column" alignItems="start">
                  <Link underline="none" color="inherit">
                    <UserNameCard
                      user={state.userOwner}
                      modalProps={{
                        anchorOrigin: { horizontal: "right", vertical: "top" },
                        transformOrigin: { horizontal: "left", vertical: "top" },
                      }}
                    />
                  </Link>

                  <Box display="flex">
                    <TimeCard time={state.createdTime}>{dayFromNow(state.createdTime)}</TimeCard>
                    {!!state.channelName && (
                      <Typography variant="h6" ml={0.5}>{` in #${state.channelName}`}</Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {state.isShowThreadScriptBar && (
            <Box flexBasis={300} display="flex" flexDirection="column">
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
                  <Tab label="Thread" value="thread" />
                  <Tab label="Transcript" value="transcript" />
                </Tabs>
              </Box>

              <Box hidden={tabValue !== "thread"} px={2.5} py={2}>
                <Box>Thread</Box>
              </Box>
              <Box
                hidden={tabValue !== "transcript"}
                px={2.5}
                py={2}
                overflow={["visible", "auto"]}
              >
                {(state.scripts || []).map((script) => {
                  return (
                    <Box key={script.currentTime} mb={2}>
                      <Link
                        underline="hover"
                        color={rgba(color.MAX, 0.5)}
                        onClick={() => handleChangeProgressSlider(script.currentTime)}
                      >
                        {buildProgressTime(script.currentTime)}
                      </Link>
                      <Link
                        underline="hover"
                        color="inherit"
                        onClick={() => handleChangeProgressSlider(script.currentTime)}
                      >
                        <Typography lineHeight="22px">{script.label}</Typography>
                      </Link>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>
      </ModalBody>
    </Modal>
  );
};

export default FullScreenModal;
