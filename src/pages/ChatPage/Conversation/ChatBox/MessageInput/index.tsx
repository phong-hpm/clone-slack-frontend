import { FC } from "react";

// redux store
import { useSelector } from "store";

// redux selectors
import * as channelsSelector from "store/selectors/channels.selector";

// components
import { MessageInputProvider } from "./InputContext";
import InputMain, { InputMainProps } from "./InputMain";

export interface MessageInputProps extends InputMainProps {
  isEditMode?: boolean;
}

const MessageInput: FC<MessageInputProps> = ({ isEditMode, defaultValue, ...props }) => {
  const selectedChannel = useSelector(channelsSelector.getSelectedChannel);

  return (
    <MessageInputProvider isEditMode={isEditMode}>
      <InputMain
        key={selectedChannel?.id || ""} // key for trigger render react-quill placeholder
        placeHolder={`Send a message to #${selectedChannel?.name || ""}`}
        defaultValue={defaultValue}
        {...props}
      />
    </MessageInputProvider>
  );
};

export default MessageInput;
