import { FC, useEffect, useRef, useState } from "react";

// images
import defaultAvatar from "assets/images/default_avatar.png";

// redux store
import { useSelector } from "store";

// redux selectors
import * as authSelectors from "store/selectors/auth.selector";
import * as usersSelectors from "store/selectors/channelUsers.selector";

// components
import ReactQuill from "react-quill";
import { Delta } from "quill";
import { Avatar, Box, Link, Typography } from "@mui/material";
import MessageInput from "pages/ChatPage/Conversation/ChatBox/MessageInput";
import MessageActions from "pages/ChatPage/Conversation/ChatBox/MessageActions";
import Bookmark from "./Bookmark";
import Reactions from "./Reactions";
import MediaFileList from "./MediaFileList";
import ShareMessageModal from "./ShareMessageModal";

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
import DeleteMessageModal from "./DeleteMessageModal";
import MessageShared from "../MessageShared";

export interface MessageContentProps {
  isReadOnly?: boolean;
  isMessageOnly?: boolean;
  isHideMessageTime?: boolean;
  userOwner?: UserType;
  message: MessageType;
}

const MessageContent: FC<MessageContentProps> = ({
  isReadOnly,
  isMessageOnly,
  isHideMessageTime,
  userOwner,
  message: messageProp,
}) => {
  const quillRef = useRef<ReactQuill>(null);

  const { emitEditMessage, emitRemoveMessage } = useMessageSocket();

  const user = useSelector(authSelectors.getUser);
  const channelUserList = useSelector(usersSelectors.getChannelUserList);

  // [message] state will help to keep message reference
  // case: when user update 1 message, [MessageList] will re-render
  //       if not keep message re-ference,
  //       all [MessageContent] will be triggered re-render
  const [message, setMessage] = useState(messageProp);
  const [isShowShareMessageModal, setShowShareMessageModal] = useState(false);
  const [isShowDeleteMessageModal, setShowDeleteMessageModal] = useState(false);
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
    const delta = addNecessaryFields(messageProp.delta, channelUserList, user.id);
    setMessage({ ...messageProp, isOwner, delta });
  }, [user.id, channelUserList, messageProp]);

  useEffect(() => {
    // wait for update user mention
    if (!channelUserList?.length) return;
    if (isEditing || !quillRef.current || !message.delta.ops?.length) return;
    quillRef.current.getEditor().setContents(message.delta);
  }, [isEditing, channelUserList, message.delta]);

  // after [isEditing] state change, we should reset [isHovering] state
  // 1: when user change status to editing, should remove hovering status
  // 1: when user change status to NOT editing, should remove hovering status
  useEffect(() => setHovering(false), [isEditing]);

  const bgcolor =
    isEditing || isShowDeleteMessageModal
      ? "rgba(242, 199, 68, 0.2)"
      : message.isStared && !isMessageOnly
      ? "rgba(242, 199, 68, 0.1)"
      : isHovering
      ? "rgb(39, 36, 44)"
      : "";

  return (
    <>
      <Box
        position="relative"
        flex="1"
        px={isReadOnly ? 0 : 2.5}
        bgcolor={bgcolor}
        // when user is editing or in readOnly mode, [isHovering] always have false value
        onMouseOver={() => setHovering(!isEditing && !isReadOnly)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* stared */}
        {!isMessageOnly && message.isStared && (
          <Box mt={0.5}>
            <Bookmark isStared={message.isStared} />
          </Box>
        )}

        {/* message content */}
        <Box py={0.75}>
          <Box display="flex">
            <Box flexBasis={36} mr={1} color={color.MAX_SOLID}>
              {userOwner && (
                <Avatar src={userOwner.avatar}>
                  <img src={defaultAvatar} alt="" />
                </Avatar>
              )}
              {!isHideMessageTime && !userOwner && isHovering && (
                <Link underline="hover" color={color.MAX_SOLID} textAlign="end">
                  <TimeCard
                    time={message.createdTime}
                    formatFn={dayFormat.time}
                    typographyProps={{ lineHeight: "20px" }}
                  />
                </Link>
              )}
            </Box>

            {/* message */}
            <Box flex="1">
              {!isEditing && userOwner && (
                <Box display="flex" alignItems="flex-end">
                  <Link underline="hover" color="inherit" mt={-0.5}>
                    <UserNameCard user={userOwner} />
                  </Link>
                  {!isHideMessageTime && (
                    <>
                      {isReadOnly ? (
                        <Typography variant="h6" color={color.MAX_SOLID}>
                          {`${dayFormat.dayO(message.createdTime)} at ${dayFormat.timeA(
                            message.createdTime
                          )}`}
                        </Typography>
                      ) : (
                        <Link underline="hover" color={color.MAX_SOLID}>
                          <TimeCard time={message.createdTime} formatFn={dayFormat.timeA} />
                        </Link>
                      )}
                    </>
                  )}
                </Box>
              )}

              {!!message.delta.ops && (
                <>
                  {isEditing ? (
                    <Box py={0.5}>
                      <MessageInput
                        autoFocus
                        defaultValue={updateEditableLinkField(message.delta, true)}
                        configActions={{ emoji: true, cancel: true, send: true }}
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

              {/* shared message */}
              {!isReadOnly && message.sharedMessage && (
                <Box mt={0.75}>
                  <MessageShared
                    isMessageOnly
                    isHideMessageTime
                    userOwner={message.sharedMessageOwner}
                    message={message.sharedMessage}
                  />
                </Box>
              )}

              {/* MediaFileList */}
              {!!message.files?.length && (
                <MediaFileList
                  messageId={message.id}
                  messageUserId={message.user}
                  files={message.files}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* reactions */}
        {!isMessageOnly && !!Object.keys(message.reactions).length && (
          <Box pb={0.75}>
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
              onClickDelete={() => setShowDeleteMessageModal(true)}
              onClose={() => setHovering(false)}
            />
          </Box>
        )}
      </Box>

      {/* share message modal */}
      <ShareMessageModal
        isOpen={isShowShareMessageModal}
        message={message}
        onClose={() => setShowShareMessageModal(false)}
        onSubmit={() => {}}
      />
      {/* demete message modal */}
      <DeleteMessageModal
        isOpen={isShowDeleteMessageModal}
        message={message}
        onClose={() => setShowDeleteMessageModal(false)}
        onSubmit={handleDelete}
      />
    </>
  );
};

export default MessageContent;
