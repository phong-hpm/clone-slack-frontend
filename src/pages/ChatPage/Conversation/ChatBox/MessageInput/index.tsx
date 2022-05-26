import { FC, memo, useCallback, useMemo } from "react";

// redux store
import { useDispatch, useSelector } from "store";

// redux actions
import { uploadFiles } from "store/actions/message/uploadFiles";

// redux selectors
import * as channelsSelector from "store/selectors/channels.selector";

// components
import { MessageInputProvider } from "./InputContext";
import InputMain, { InputMainProps } from "./InputMain";

// hooks
import useMessageSocket from "pages/ChatPage/hooks/useMessageSocket";

// types
import { Delta } from "quill";
import { MessageFileType } from "store/slices/_types";

export interface MessageInputProps extends Omit<InputMainProps, "onSend"> {
  mode: "input" | "edit" | "custom";
  onSend?: (delta: Delta, files: MessageFileType[]) => void;
}

const MessageInput: FC<MessageInputProps> = ({ mode, defaultValue, onSend, ...props }) => {
  const dispatch = useDispatch();

  const { emitAddMessage } = useMessageSocket();

  const selectedChannel = useSelector(channelsSelector.getSelectedChannel);

  const placeHolder = useMemo(() => {
    if (!selectedChannel?.name || !selectedChannel?.type) return "";

    if (selectedChannel?.type === "channel") {
      return `Send a message to #${selectedChannel.name}`;
    } else {
      return `Send a message to ${selectedChannel.name}`;
    }
  }, [selectedChannel?.name, selectedChannel?.type]);

  const handleSend = useCallback(
    (delta: Delta, files: MessageFileType[]) => {
      // controlled
      if (onSend) return onSend(delta, files);

      // uncontrolled
      if (files.length) dispatch(uploadFiles({ files, delta }));
      else emitAddMessage(delta);
    },
    [onSend, emitAddMessage, dispatch]
  );

  return (
    <MessageInputProvider mode={mode}>
      <InputMain
        placeHolder={placeHolder}
        defaultValue={defaultValue}
        {...props}
        onSend={handleSend}
      />
    </MessageInputProvider>
  );
};

export default memo(MessageInput);
