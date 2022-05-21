import { FC } from "react";

// components
import { Box, Typography, Link } from "@mui/material";
import { Modal, ModalBody, ModalProps } from "components/Modal";
import TimeCard from "components/TimeCard";

// utils
import { color } from "utils/constants";
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
            <Typography variant="h5" mr={0.5}>{`${user.name} at`}</Typography>
            <TimeCard time={created} typographyProps={{ variant: "h5" }} />
          </Box>

          <Box>
            {scripts.map((script) => {
              return (
                <Box key={script.currentTime} display="flex" my={1}>
                  <Link underline="hover" onClick={() => handleClickScript(script.currentTime)}>
                    {buildProgressTime(script.currentTime)}
                  </Link>
                  <Typography ml={1}>{script.label}</Typography>
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
