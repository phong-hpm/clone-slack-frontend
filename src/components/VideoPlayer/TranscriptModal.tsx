import { FC } from "react";

// components
import { Box, Tooltip, Typography, Link } from "@mui/material";
import { Modal, ModalBody, ModalProps } from "components/Modal";

// utils
import { color } from "utils/constants";
import { dayFormat } from "utils/dayjs";
import { buildProgressTime } from "utils/waveSurver";

// types
import { TranScriptType } from "./_types";
import { UserType } from "store/slices/_types";

export interface TranscriptModalProps extends ModalProps {
  created: number;
  scripts: TranScriptType[];
  user: UserType;
  onClickScript?: (currentTime: number) => void;
}

const TranscriptModal: FC<TranscriptModalProps> = ({
  created,
  scripts,
  user,
  onClickScript,
  ...props
}) => {
  const handleClickScript = (currentTime: number) => {
    if (onClickScript) onClickScript(currentTime);
  };

  return (
    <Modal isCloseBtn {...props}>
      <ModalBody>
        <Box mt={1} color={color.PRIMARY}>
          <Typography variant="h4">Transcript</Typography>
          <Box display="flex" mb={2}>
            <Typography variant="h5">{`${user.name} at`}</Typography>
            <Tooltip title={`${dayFormat.dayO(created)} at ${dayFormat.fullTimeA(created)}`}>
              <Typography variant="h5" sx={{ ml: 0.5 }}>
                {dayFormat.time(created)}
              </Typography>
            </Tooltip>
          </Box>

          <Box>
            {scripts.map((script) => {
              return (
                <Box key={script.currentTime} my={1}>
                  <Link underline="hover" onClick={() => handleClickScript(script.currentTime)}>
                    {buildProgressTime(script.currentTime)}
                  </Link>
                  <Link
                    color={color.PRIMARY}
                    underline="hover"
                    sx={{ ml: 1 }}
                    onClick={() => handleClickScript(script.currentTime)}
                  >
                    {script.label}
                  </Link>
                </Box>
              );
            })}
          </Box>
        </Box>
      </ModalBody>
    </Modal>
  );
};

export default TranscriptModal;
