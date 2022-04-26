import { FC, useRef } from "react";
import { Box } from "@mui/material";

export interface MessageTextAreaProps {
  onSend: (text: string) => void;
}

const MessageTextArea: FC<MessageTextAreaProps> = ({ onSend }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!textareaRef.current?.value) return;

    onSend(textareaRef.current.value);
    textareaRef.current.value = "";
  };

  return (
    <Box>
      <textarea ref={textareaRef} />
      <button onClick={handleSend}>send</button>
    </Box>
  );
};

export default MessageTextArea;
