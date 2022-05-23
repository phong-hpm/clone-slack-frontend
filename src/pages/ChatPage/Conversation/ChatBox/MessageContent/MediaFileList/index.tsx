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
import { MessageFileType } from "store/slices/_types";
import MediaFile from "./MediaFile";

export interface MediaFileListProps {
  messageId: string;
  messageUserId: string;
  files?: MessageFileType[];
}

const MediaFileList: FC<MediaFileListProps> = ({ messageId, messageUserId, files }) => {
  const userOwner = useSelector(usersSelector.getUserById(messageUserId));

  const [isCollapsed, setCollapsed] = useState(false);

  if (!files?.length) return <></>;

  return (
    <Box display="flex" flexDirection="column" pt={0.5} pr={0.5}>
      {/* Label */}
      <Box display="flex" color={color.HIGH} onClick={() => setCollapsed(!isCollapsed)}>
        <Typography variant="h5" sx={{ mr: 0.5, textTransform: "capitalize" }}>
          {files.length > 1 ? `${files.length} files` : files[0].type}
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
          {files.map((file) => {
            return (
              <MediaFile key={file.id} messageId={messageId} file={file} userOwner={userOwner} />
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

export default MediaFileList;
