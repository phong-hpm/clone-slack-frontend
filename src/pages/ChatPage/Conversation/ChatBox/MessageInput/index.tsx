import { FC, memo, useCallback, useMemo } from "react";

// redux store
import { useDispatch, useSelector } from "store";

// redux actions
import { uploadFiles } from "store/actions/message/uploadFiles";
import { emitAddMessage } from "store/actions/socket/messageSocket.action";

// redux selectors
import channelsSelectors from "store/selectors/channels.selector";

// components
import { MessageInputProvider } from "./InputContext";
import InputMain, { InputMainProps } from "./InputMain";
import InputDropZone from "./InputDropZone";

// types
import { Delta } from "quill";
import { MessageFileType } from "store/slices/_types";
import { ContextAppStateType } from "./_types";

export interface MessageInputProps
  extends InputMainProps,
    Pick<ContextAppStateType, "configActions"> {
  isAutoSend?: boolean;
}

const MessageInput: FC<MessageInputProps> = ({
  isAutoSend,
  configActions,
  defaultValue,
  onSend,
  ...props
}) => {
  const dispatch = useDispatch();

  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  const placeHolder = useMemo(() => {
    if (!selectedChannel?.name || !selectedChannel?.type) return "";

    if (["public_channel", "private_channel"].includes(selectedChannel?.type)) {
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
      else dispatch(emitAddMessage({ delta }));
    },
    [isAutoSend, onSend, dispatch]
  );

  return (
    <MessageInputProvider configActions={configActions}>
      <InputMain
        placeHolder={placeHolder}
        defaultValue={defaultValue}
        {...props}
        // when [onSend] and [isAutoSend] are falsy,
        //   that mean this [Input] is used as native input only
        onSend={onSend || isAutoSend ? handleSend : undefined}
      />

      <InputDropZone />
    </MessageInputProvider>
  );
};

export default memo(MessageInput);
