import { FC } from "react";

// components
import { Box, Link, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import { color, rgba } from "utils/constants";

// types
import { MessageType } from "store/slices/_types";

export interface BookmarkProps {
  message: MessageType;
}

const Bookmark: FC<BookmarkProps> = ({ message }) => {
  if (!message.isStared) return <></>;

  return (
    <Box display="flex">
      <Box flexBasis={36} mr={1} display="flex" justifyContent="end">
        <SlackIcon color={color.DANGER} fontSize="small" icon="bookmark-filled" />
      </Box>

      <Link component="button" underline="hover" color={rgba(color.MAX, 0.7)}>
        <Typography variant="h5">Added to your saved items</Typography>
      </Link>
    </Box>
  );
};

export default Bookmark;
