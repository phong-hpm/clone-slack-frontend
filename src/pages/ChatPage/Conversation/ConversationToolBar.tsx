import { FC } from "react";

// components
import { Box, Button, Tooltip, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import { color } from "utils/constants";

const ConversationToolBar: FC = () => {
  return (
    <Box px={0.5} py={0.625} borderBottom={1} color={color.MAX_SOLID} borderColor={color.BORDER}>
      <Tooltip title="Add a bookmark">
        <Button size="small">
          <SlackIcon icon="plus-small" />
          <Typography mx={0.5} variant="h5">
            Add a bookmark
          </Typography>
        </Button>
      </Tooltip>
    </Box>
  );
};

export default ConversationToolBar;
