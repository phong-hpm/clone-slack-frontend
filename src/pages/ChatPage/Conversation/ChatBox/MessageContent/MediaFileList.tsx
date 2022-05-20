import { FC, useState } from "react";

// redux selectors
import * as channelsSelector from "store/selectors/channels.selector";
import * as usersSelector from "store/selectors/users.selector";

// components
import { Box, Collapse, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import ReviewAudioCard from "../MessageInput/Review/ReviewAudioCard";

// utils
import { color } from "utils/constants";

// types
import { MessageType } from "store/slices/_types";
import VideoPlayer from "components/VideoPlayer";
import { useSelector } from "store";

export interface MediaFileListProps {
  message: MessageType;
}

const MediaFileList: FC<MediaFileListProps> = ({ message }) => {
  const selectedChannel = useSelector(channelsSelector.getSelectedChannel);
  const userOwner = useSelector(usersSelector.getUserById(message.user));

  const [isCollapsed, setCollapsed] = useState(false);

  if (!message.files?.length) return <></>;

  return (
    <Box display="flex" flexDirection="column" pt={0.5} pr={0.5}>
      {/* Label */}
      <Box display="flex" color={color.HIGH} onClick={() => setCollapsed(!isCollapsed)}>
        <Typography variant="h5" sx={{ mr: 0.5, textTransform: "capitalize" }}>
          {message.files.length > 1 ? `${message.files.length} files` : message.files[0].type}
        </Typography>

        <SlackIcon
          fontSize="medium"
          cursor="pointer"
          icon={isCollapsed ? "caret-right" : "caret-down"}
        />
      </Box>

      {/* file List */}
      <Collapse in={!isCollapsed} timeout={0} unmountOnExit>
        <Box display="flex" flexWrap="wrap">
          {message.files.map((file) => {
            return file.type === "audio" ? (
              <ReviewAudioCard
                key={file.id}
                isTranscript
                isSpeedSelection
                isControls
                height={40}
                width={200}
                file={file}
              />
            ) : (
              <VideoPlayer
                key={file.id}
                src={file.url}
                created={file.created}
                thumbnail={file.thumb}
                duration={file.duration}
                scripts={file.scripts}
                ratio={file.ratio}
                userOwner={userOwner}
                channelName={selectedChannel?.name}
                style={{
                  maxWidth: 480,
                  borderRadius: 8,
                  overflow: "hidden",
                  marginTop: 8,
                  marginRight: 8,
                }}
              />
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

export default MediaFileList;
