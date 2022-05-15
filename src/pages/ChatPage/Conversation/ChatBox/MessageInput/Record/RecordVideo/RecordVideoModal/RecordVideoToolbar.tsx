import { FC, useRef, useState } from "react";

// components
import { Box, IconButton } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import RecordSettingMenu from "../RecordSettingMenu";

// utils
import { color } from "utils/constants";

// types
import { MediaDeviceInfoType } from "../../../_types";

export interface RecordVideoToolbarProps {
  isEnabledAudio: boolean;
  isEnabledVideo: boolean;
  selectedDevice: { audio: string; video: string };
  devices?: MediaDeviceInfoType[];
  toggleAudio: () => void;
  toggleVideo: () => void;
  onChangeDevice: (device: { audio?: string; video?: string }) => void;
}

const RecordVideoToolbar: FC<RecordVideoToolbarProps> = ({
  isEnabledAudio,
  isEnabledVideo,
  selectedDevice,
  devices,
  toggleAudio,
  toggleVideo,
  onChangeDevice,
}) => {
  const settingButtonRef = useRef<HTMLButtonElement>(null);
  const [isShowSettingMenu, setShowSettingMenu] = useState(false);

  return (
    <>
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        display="flex"
        p={1}
        sx={{ background: "linear-gradient(transparent,rgba(0,0,0,.6))" }}
      >
        {/* toggle video */}
        <IconButton
          className="bg-gray"
          size="large"
          sx={{ borderRadius: 1.5, mr: 1 }}
          onClick={toggleVideo}
        >
          <SlackIcon
            icon={isEnabledVideo ? "video-camera" : "stop-video-slashless"}
            fontSize="large"
          />

          {!isEnabledVideo && (
            <Box position="absolute" color={color.DANGER}>
              <SlackIcon icon="stop-video-slashonly" fontSize="large" />
            </Box>
          )}
        </IconButton>

        {/* toggle microphone */}
        <IconButton
          className="bg-gray"
          size="large"
          sx={{ borderRadius: 1, mr: 1 }}
          onClick={toggleAudio}
        >
          <SlackIcon
            icon={isEnabledAudio ? "microphone" : "microphone-slashless"}
            fontSize="large"
          />
          {!isEnabledAudio && (
            <Box position="absolute" color={color.DANGER}>
              <SlackIcon icon="microphone-slashonly" fontSize="large" />
            </Box>
          )}
        </IconButton>

        {/* blur background screen */}
        <IconButton className="bg-gray" size="large" sx={{ borderRadius: 1, mr: 1 }}>
          <SlackIcon icon="sparkles" fontSize="large" />
        </IconButton>

        {/* setting devices */}
        <IconButton
          ref={settingButtonRef}
          className="bg-gray"
          size="large"
          sx={{ borderRadius: 1, mr: 1 }}
          onClick={() => setShowSettingMenu(true)}
        >
          <SlackIcon icon="cog-o" fontSize="large" />
        </IconButton>
      </Box>

      {/* setting Menu */}
      <RecordSettingMenu
        open={isShowSettingMenu}
        anchorEl={settingButtonRef.current}
        devices={devices}
        selectedAudioId={selectedDevice.audio}
        selectedVideoId={selectedDevice.video}
        onSelectAudioDevice={(id) => onChangeDevice({ audio: id })}
        onSelectVideoDevice={(id) => onChangeDevice({ video: id })}
        onClose={() => setShowSettingMenu(false)}
      />
    </>
  );
};

export default RecordVideoToolbar;
