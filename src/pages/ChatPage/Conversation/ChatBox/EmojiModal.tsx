import { FC } from "react";

// components
import EmojiPicker, { EmojiIconType } from "components/EmojiPicker";
import { Modal, ModalProps } from "components/Modal";
import { Box, CircularProgress, Typography } from "@mui/material";

// components

export interface EmojiModalProps extends ModalProps {
  onEmojiSelect: (emoji: EmojiIconType) => void;
}

const EmojiModal: FC<EmojiModalProps> = ({ onEmojiSelect, onClose, ...props }) => {
  const handleEmojiSelect = (emoji: EmojiIconType) => {
    onEmojiSelect(emoji);
    onClose();
  };

  return (
    <Modal
      anchorOrigin={{ horizontal: "left", vertical: "top" }}
      transformOrigin={{ horizontal: "left", vertical: "bottom" }}
      transformExtra={{ vertical: 8 }}
      onClose={onClose}
      style={{ content: { width: "352px", backgroundColor: "rgb(21, 22, 23)" } }}
      {...props}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Loading emoji picker...</Typography>
      </Box>
      <EmojiPicker onEmojiSelect={handleEmojiSelect} />
    </Modal>
  );
};

export default EmojiModal;
