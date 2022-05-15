import { FC, useState } from "react";

// components
import { Box, Collapse, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import ReviewAudioCard from "../MessageInput/Review/ReviewAudioCard";
import ReviewVideoCard from "../MessageInput/Review/ReviewVideoCard";

// utils
import { color } from "utils/constants";

// types
import { MessageType } from "store/slices/_types";

export interface MediaFileListProps {
  message: MessageType;
}

const MediaFileList: FC<MediaFileListProps> = ({ message }) => {
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
        <Box display="flex" flexWrap="wrap" mt={1}>
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
              <ReviewVideoCard key={file.id} file={file} />
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

export default MediaFileList;
