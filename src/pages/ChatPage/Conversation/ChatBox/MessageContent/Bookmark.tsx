import { FC } from "react";

// redux slices
import { MessageType } from "store/slices/messages.slice";

// components
import { Box, Link, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import { color, rgba } from "utils/constants";

export interface BookmarkProps {
  message: MessageType;
}

const Bookmark: FC<BookmarkProps> = ({ message }) => {
  if (!message.isStared) return <></>;

  return (
    <Box display="flex" px={2.5} py={0.5}>
      <Box flexBasis={36} display="flex" justifyContent="end" mt={0.5} mr={1}>
        <SlackIcon color={color.DANGER} fontSize="small" icon="bookmark-filled" />
      </Box>

      <Link component="button" underline="hover" color={rgba(color.MAX, 0.7)}>
        <Typography variant="h5">Added to your saved items</Typography>
      </Link>
    </Box>
  );
};

export default Bookmark;
