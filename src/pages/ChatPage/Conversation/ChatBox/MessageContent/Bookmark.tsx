import { FC, memo } from "react";

// components
import { Box, Link, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import { color, rgba } from "utils/constants";

export interface BookmarkProps {
  isStarred?: boolean;
}

const Bookmark: FC<BookmarkProps> = ({ isStarred }) => {
  if (!isStarred) return <></>;
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

export default memo(Bookmark);
