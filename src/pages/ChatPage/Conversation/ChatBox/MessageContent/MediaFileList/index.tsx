import { FC, useState } from "react";
import { useSelector } from "store";

// redux selectors
import * as usersSelector from "store/selectors/users.selector";

// components
import { Box, Collapse, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import { color } from "utils/constants";

// types
import { MessageType } from "store/slices/_types";
import MediaFile from "./MediaFile";

export interface MediaFileListProps {
  message: MessageType;
}

const MediaFileList: FC<MediaFileListProps> = ({ message }) => {
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
            return (
              <MediaFile key={file.id} messageId={message.id} file={file} userOwner={userOwner} />
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

export default MediaFileList;
