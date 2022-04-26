import { FC } from "react";

// icons
import { Add as AddIcon } from "@mui/icons-material";

// components
import { Box, Button, Typography } from "@mui/material";

const ConversationToolBar: FC = () => {
  return (
    <Box px={0.5} py={0.625} borderBottom={1} borderColor="rgba(209, 210, 211, 0.1)">
      <Button size="small" variant="outlined" color="primary">
        <AddIcon fontSize="inherit" />
        <Typography mx={0.5} variant="h5">
          Add a bookmark
        </Typography>
      </Button>
    </Box>
  );
};

export default ConversationToolBar;
