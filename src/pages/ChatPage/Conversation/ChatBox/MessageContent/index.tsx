import { FC, memo, useEffect, useRef, useState } from "react";

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
import { Avatar, Box, Link, Typography } from "@mui/material";
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
import { updateEditableLinkField } from "utils/message";

// types
import { UserType, MessageType } from "store/slices/_types";
import TimeCard from "components/TimeCard";
import UserNameCard from "components/UserNameCard";

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

  useEffect(() => {
    // wait for update user mention
    if (!userList?.length) return;
    if (isEditing || !quillRef.current || !message.delta.ops?.length) return;
    quillRef.current.getEditor().setContents(message.delta);
  }, [isEditing, userList, message.delta]);

  // after [isEditing] state change, we should reset [isHovering] state
  // 1: when user change status to editing, should remove hovering status
  // 1: when user change status to NOT editing, should remove hovering status
  useEffect(() => setHovering(false), [isEditing]);

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
      {message.isStared && (
        <Box my={1}>
          <Bookmark isStared={message.isStared} />
        </Box>
      )}

      <Box my={0.75}>
        <Box display="flex">
          <Box flexBasis={36} mr={1} color={color.MAX_SOLID}>
            {userOwner && (
              <Avatar src={userOwner.avatar}>
                <img src={defaultAvatar} alt="" />
              </Avatar>
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
                <Link underline="hover" color="inherit" mt={-0.5}>
                  <UserNameCard user={userOwner} />
                </Link>

                <Link underline="hover" color={color.MAX_SOLID}>
                  <TimeCard time={message.created} formatFn={dayFormat.timeA} />
                </Link>
              </Box>
            )}

            {message.delta.ops && (
              <>
                {isEditing ? (
                  <Box py={0.5}>
                    <MessageInput
                      autoFocus
                      isEditMode
                      defaultValue={updateEditableLinkField(message.delta, true)}
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
              </>
            )}

            {/* MediaFileList */}
            <MediaFileList
              messageId={message.id}
              messageUserId={message.user}
              files={message.files}
            />
          </Box>
        </Box>
      </Box>

      {/* reactions */}
      {!!message.reactions?.length && (
        <Box my={1}>
          <Reactions messageId={message.id} reactions={message.reactions} />
        </Box>
      )}

      {/* action bar */}
      {isShowActions && (
        <Box position="absolute" right={12} top={-20}>
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
        </Box>
      )}

      {/* share message modal */}
      <ShareMessageModal
        isOpen={isShowShareMessageModal}
        onClose={() => setShowShareMessageModal(false)}
        onSubmit={() => {}}
      />
    </Box>
  );
};

export default memo(MessageContent);
