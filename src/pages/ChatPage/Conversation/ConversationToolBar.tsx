import { FC } from "react";

// components
import { Box, Button, Typography } from "@mui/material";
import SlackIcon from "../../../components/SlackIcon";

const ConversationToolBar: FC = () => {
  return (
    <Box px={0.5} py={0.625} borderBottom={1} borderColor="rgba(209, 210, 211, 0.1)">
      <Button size="small" variant="outlined" color="primary">
        <SlackIcon icon="plus-small" />
        <Typography mx={0.5} variant="h5">
          Add a bookmark
        </Typography>
      </Button>
    </Box>
  );
};

export default ConversationToolBar;
