import { FC } from "react";

// components
import EmojiPicker, { EmojiIconType } from "components/EmojiPicker";
import { Modal, ModalProps } from "components/Modal";

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
      autoWidth
      anchorOrigin={{ horizontal: "left", vertical: "top" }}
      transformOrigin={{ horizontal: "left", vertical: "bottom" }}
      transformExtra={{ vertical: 8 }}
      onClose={onClose}
      {...props}
    >
      <EmojiPicker onEmojiSelect={handleEmojiSelect} />
    </Modal>
  );
};

export default EmojiModal;
