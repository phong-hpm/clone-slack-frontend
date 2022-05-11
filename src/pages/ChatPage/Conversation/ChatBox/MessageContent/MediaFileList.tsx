import { FC, useState } from "react";

// redux slices
import { MessageType } from "store/slices/messages.slice";

// components
import { Box, Collapse, Typography } from "@mui/material";
import MediaFile from "./MediaFile";
import SlackIcon from "components/SlackIcon";

// utils
import { color } from "utils/constants";

export interface MediaFileListProps {
  message: MessageType;
}

const MediaFileList: FC<MediaFileListProps> = ({ message }) => {
  const [isCollapsed, setCollapsed] = useState(false);

  if (!message.files?.length) return <></>;

  return (
    <Box display="flex" flexDirection="column" pt={0.5} pr={0.5}>
      {/* Label */}
      <Box display="flex" mb={0.5} color={color.HIGH} onClick={() => setCollapsed(!isCollapsed)}>
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
            return <MediaFile key={file.id} file={file} />;
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

export default MediaFileList;
