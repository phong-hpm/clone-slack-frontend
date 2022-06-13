import { FC } from "react";

// components
import { Box, IconButton, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import { ModalHeader } from "components/Modal";

// types
import { StatusType } from "./_types";

export interface RecordVideoModalHeaderProps {
  status: StatusType;
}

const RecordVideoModalHeader: FC<RecordVideoModalHeaderProps> = ({ status }) => {
  return (
    <ModalHeader>
      {status === "active" && (
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography variant="h3">Record video clip</Typography>
          <Box>
            <IconButton size="large" sx={{ borderRadius: 1 }}>
              <SlackIcon icon="question-circle" fontSize="medium" />
            </IconButton>
          </Box>
        </Box>
      )}
    </ModalHeader>
  );
};

export default RecordVideoModalHeader;
