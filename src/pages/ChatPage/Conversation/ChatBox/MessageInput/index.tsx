import { FC, memo, useCallback } from "react";

// redux store
import { useDispatch } from "store";

// redux actions
import { uploadFiles } from "store/actions/message/uploadFiles";

// components
import { MessageInputProvider } from "./InputContext";
import InputMain, { InputMainProps } from "./InputMain";

// hooks
import useMessageSocket from "pages/ChatPage/hooks/useMessageSocket";

// types
import { Delta } from "quill";
import { MessageFileType } from "store/slices/_types";

export interface MessageInputProps extends Omit<InputMainProps, "onSend"> {
  isEditMode?: boolean;
  onSend?: (delta: Delta, files: MessageFileType[]) => void;
}

const MessageInput: FC<MessageInputProps> = ({ isEditMode, defaultValue }) => {
  const dispatch = useDispatch();

  const { emitAddMessage } = useMessageSocket();

  const handleSend = useCallback(
    (delta: Delta, files: MessageFileType[]) => {
      if (files.length) {
        dispatch(uploadFiles({ files, delta }));
      } else {
        emitAddMessage(delta);
      }
    },
    [dispatch, emitAddMessage]
  );

  return (
    <MessageInputProvider isEditMode={isEditMode}>
      <InputMain placeHolder={`Send a message`} defaultValue={defaultValue} onSend={handleSend} />
    </MessageInputProvider>
  );
};

export default memo(MessageInput);
