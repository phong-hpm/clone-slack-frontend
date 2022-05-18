import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";

// images
import defaultAvatar from "assets/images/default_avatar.png";

// redux store
import { useSelector } from "store";

// redux selectors
import * as authSelectors from "store/selectors/auth.selector";
import * as usersSelectors from "store/selectors/users.selector";

// components
import ReactQuill from "react-quill";
import { Delta } from "quill";
import { Avatar, Box, Typography } from "@mui/material";
import MessageInput from "pages/ChatPage/Conversation/ChatBox/MessageInput";
import MessageActions from "pages/ChatPage/Conversation/ChatBox/MessageActions";
import ShareMessageModal from "pages/ChatPage/Conversation/ChatBox/ShareMessageModal";
import Bookmark from "./Bookmark";
import Reactions from "./Reactions";
import MediaFileList from "./MediaFileList";

// hooks
import useMessageSocket from "pages/ChatPage/hooks/useMessageSocket";

// utils
import { dayFormat } from "utils/dayjs";
import { color } from "utils/constants";
import { addNecessaryFields } from "utils/message";
import { updateReadonlyLinkField } from "utils/message";

// types
import { UserType, MessageType } from "store/slices/_types";

export interface MessageContentProps {
  userOwner?: UserType;
  message: MessageType;
}

const MessageContent: FC<MessageContentProps> = ({ userOwner, message: messageProp }) => {
  const quillRef = useRef<ReactQuill>(null);

  const { emitEditMessage, emitRemoveMessage } = useMessageSocket();

  const user = useSelector(authSelectors.getUser);
  const userList = useSelector(usersSelectors.getUserList);

  // [message] state will help to keep message reference
  // case: when user update 1 message, [MessageList] will re-render
  //       if not keep message re-ference,
  //       all [MessageContent] will be triggered re-render
  const [message, setMessage] = useState(messageProp);
  const [isShowShareMessageModal, setShowShareMessageModal] = useState(false);
  const [isHovering, setHovering] = useState(false);
  const [isEditing, setEditing] = useState(false);

  const isShowActions = isHovering && !isEditing;

  const handleEdit = (id: string, delta: Delta) => {
    setEditing(false);
    emitEditMessage(id, delta);
  };

  const handleDelete = () => {
    setHovering(false);
    emitRemoveMessage(message.id);
  };

  // useEffect will help to increate performance
  useEffect(() => {
    const isOwner = messageProp.user === user.id;
    const delta = addNecessaryFields(messageProp.delta, userList, user.id);
    setMessage({ ...messageProp, isOwner, delta });
  }, [user.id, userList, messageProp]);

  useLayoutEffect(() => {
    // wait for update user mention
    if (!userList?.length) return;
    if (isEditing || !quillRef.current || !message.delta.ops?.length) return;
    quillRef.current.getEditor().setContents(updateReadonlyLinkField(message.delta, true));
  }, [isEditing, userList, message.delta]);

  // after [isEditing] state change, we should reset [isHovering] state
  // 1: when user change status to editing, should remove hovering status
  // 1: when user change status to NOT editing, should remove hovering status
  useLayoutEffect(() => setHovering(false), [isEditing]);

  if (!message.delta.ops?.length && !message.files?.length) return <></>;

  const bgcolor = isEditing
    ? "rgba(242, 199, 68, 0.2)"
    : message.isStared
    ? "rgba(242, 199, 68, 0.1)"
    : isHovering
    ? "rgb(39, 36, 44)"
    : "";

  return (
    <Box
      position="relative"
      flex="1"
      px={2.5}
      bgcolor={bgcolor}
      // when user is editing, [isHovering] always have false value
      onMouseOver={() => setHovering(!isEditing)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* stared */}
      <Box my={1}>
        <Bookmark message={message} />
      </Box>

      <Box my={1}>
        <Box display="flex">
          <Box flexBasis={36} mr={1} color={color.MAX_SOLID}>
            {userOwner && (
              <Box mt={0.5}>
                <Avatar src={defaultAvatar} />
              </Box>
            )}
            {!userOwner && isHovering && (
              <Typography variant="h6" align="right" lineHeight="20px">
                {dayFormat.time(message.created)}
              </Typography>
            )}
          </Box>

          {/* message */}
          <Box flex="1">
            {!isEditing && userOwner && (
              <Box display="flex" alignItems="flex-end">
                <Typography fontWeight={900} mr={1}>
                  {userOwner?.name || "unknow"}
                </Typography>
                <Typography variant="h6" lineHeight="20px" color={color.MAX_SOLID}>
                  {dayFormat.timeA(message.created)}
                </Typography>
              </Box>
            )}

            {message.delta.ops && (
              <>
                {isEditing ? (
                  <Box py={0.5}>
                    <MessageInput
                      autoFocus
                      isEditMode
                      defaultValue={updateReadonlyLinkField(message.delta, false)}
                      onCancel={() => setEditing(false)}
                      onSend={(delta) => handleEdit(message.id, delta)}
                    />
                  </Box>
                ) : (
                  <ReactQuill
                    ref={quillRef}
                    className="quill-editor"
                    bounds={"#root"}
                    modules={{ toolbar: false, clipboard: { matchVisual: false } }}
                    readOnly
                  />
                )}

                <Typography>
                  {message.isEdited && (
                    <Typography variant="h5" pl={0.375} component="span" color={color.HIGH_SOLID}>
                      (edited)
                    </Typography>
                  )}
                </Typography>
              </>
            )}

            {/* MediaFileList */}
            <MediaFileList message={message} />
          </Box>
        </Box>
      </Box>

      {/* reactions */}
      <Box my={1}>
        <Reactions message={message} />
      </Box>

      {/* action bar */}
      <Box position="absolute" right={12} top={-20}>
        {isShowActions && (
          <MessageActions
            messageId={message.id}
            isStared={message.isStared}
            isOwner={message.isOwner}
            isSystem={message.type === "channel_join"}
            onClickShare={() => setShowShareMessageModal(true)}
            onClickEdit={() => setEditing(true)}
            onClickDelete={handleDelete}
            onClose={() => setHovering(false)}
          />
        )}
      </Box>

      {/* share message modal */}
      <ShareMessageModal
        isOpen={isShowShareMessageModal}
        message={message}
        onClose={() => setShowShareMessageModal(false)}
        onSubmit={() => {}}
      />
    </Box>
  );
};

export default MessageContent;
