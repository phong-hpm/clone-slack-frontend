import { FC, useEffect, useMemo, useRef, useState } from "react";

// images
import defaultAvatar from "assets/images/default_avatar.png";

// redux store
import { useDispatch, useSelector } from "store";

// store actions
import { emitEditMessage, emitRemoveMessage } from "store/actions/socket/messageSocket.action";

// redux selectors
import userSelectors from "store/selectors/user.selector";
import teamUsersSelectors from "store/selectors/teamUsers.selector";

// components
import ReactQuill from "react-quill";
import { Delta } from "quill";
import { Avatar, Box, Link, Typography, useMediaQuery } from "@mui/material";
import MessageInput from "pages/ChatPage/Conversation/ChatBox/MessageInput";
import MessageActions from "pages/ChatPage/Conversation/ChatBox/MessageActions";
import Bookmark from "./Bookmark";
import Reactions from "./Reactions";
import MediaFileList from "./MediaFileList";
import TimeCard from "components/TimeCard";
import UserNameCard from "components/UserNameCard";
import MessageShared from "../MessageShared";
import ShareMessageModal from "./ShareMessageModal";
import DeleteMessageModal from "./DeleteMessageModal";
import UserDetailModal from "components/UserDetailModal";

// utils
import { dayFormat } from "utils/dayjs";
import { color } from "utils/constants";
import { addNecessaryFields } from "utils/message";
import { updateEditableLinkField } from "utils/message";

// types
import { UserType, MessageType } from "store/slices/_types";

export interface MessageContentProps {
  isPreventSharedMessage?: boolean;
  isReadOnly?: boolean;
  isMessageOnly?: boolean;
  isHideMessageTime?: boolean;
  userOwner?: UserType;
  message: MessageType;
}

const MessageContent: FC<MessageContentProps> = ({
  isPreventSharedMessage,
  isReadOnly,
  isMessageOnly,
  isHideMessageTime,
  userOwner,
  message,
}) => {
  const dispatch = useDispatch();

  const quillRef = useRef<ReactQuill>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const keepRef = useRef<{ displayDelta?: Delta }>({});

  const user = useSelector(userSelectors.getUser);
  const teamUserList = useSelector(teamUsersSelectors.getTeamUserList);

  const [isHovering, setHovering] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isShowUserModal, setShowUserModal] = useState(false);
  const [isShowShareMessageModal, setShowShareMessageModal] = useState(false);
  const [isShowDeleteMessageModal, setShowDeleteMessageModal] = useState(false);

  const editingMessage = useMemo(() => {
    const addedMessage = addNecessaryFields(message.delta, teamUserList, user.id);

    return updateEditableLinkField(addedMessage, true);
  }, [message.delta, teamUserList, user.id]);

  const handleEdit = (id: string, delta: Delta) => {
    setEditing(false);
    dispatch(emitEditMessage({ id, delta }));
  };

  const handleDelete = () => {
    setHovering(false);
    dispatch(emitRemoveMessage({ id: message.id }));
  };

  useEffect(() => {
    // wait for update user mention
    if (!user.id || !quillRef.current || !teamUserList.length) return;
    if (!message.delta.ops?.length || keepRef.current.displayDelta) return;

    keepRef.current.displayDelta = addNecessaryFields(message.delta, teamUserList, user.id);
    quillRef.current.getEditor().setContents(keepRef.current.displayDelta);
  }, [user.id, teamUserList, message.id, message.delta]);

  // after [isEditing] state change, we should reset [isHovering] state
  // 1: when user change status to editing, should remove hovering status
  // 1: when user change status to NOT editing, should remove hovering status
  useEffect(() => setHovering(false), [isEditing]);

  const bgcolor =
    isEditing || isShowDeleteMessageModal
      ? "rgba(242, 199, 68, 0.2)"
      : message.isStarred && !isMessageOnly
      ? "rgba(242, 199, 68, 0.1)"
      : isHovering
      ? "rgb(39, 36, 44)"
      : "";

  const isDisplayMessageActions = isHovering && !isEditing;
  const isDisplayStared = !isEditing && !isMessageOnly && message.isStarred;
  const isDisplayReaction = !isEditing && !isMessageOnly && !!Object.keys(message.reactions).length;

  const isDisplayMessage = !!message.delta.ops?.length;
  const isDisplayMessageShared = !isPreventSharedMessage && !isReadOnly && message.sharedMessage;

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
        {isDisplayStared && (
          <Box mt={0.5}>
            <Bookmark isStarred={message.isStarred} />
          </Box>
        )}

        {/* message content */}
        <Box py={0.75}>
          <Box display="flex">
            <Box flexBasis={36} mr={1} color={color.MAX_SOLID}>
              {userOwner && (
                <Box
                  ref={avatarRef}
                  sx={{ cursor: "pointer" }}
                  onClick={() => setShowUserModal(true)}
                >
                  <Avatar src={userOwner.avatar}>
                    <img src={defaultAvatar} alt="" />
                  </Avatar>
                </Box>
              )}
              {!userOwner && isHovering && (
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

              {isDisplayMessage && (
                <ReactQuill
                  ref={quillRef}
                  className="quill-editor"
                  bounds={"#root"}
                  modules={{ toolbar: false, clipboard: { matchVisual: false } }}
                  readOnly
                  style={{ display: isEditing ? "none" : undefined }}
                />
              )}
              {isEditing && (
                <Box py={0.5}>
                  <MessageInput
                    autoFocus
                    defaultValue={editingMessage}
                    configActions={{ emoji: true, cancel: true, send: true }}
                    onCancel={() => setEditing(false)}
                    onSend={(delta) => handleEdit(message.id, delta)}
                  />
                </Box>
              )}

              {/* shared message */}
              {isDisplayMessageShared && (
                <Box mt={0.75}>
                  <MessageShared
                    isMessageOnly
                    isPreventSharedMessage
                    isHideMessageTime
                    userOwner={message.sharedMessageOwner}
                    message={message.sharedMessage!}
                  />
                </Box>
              )}

              {/* MediaFileList */}
              {!isEditing && !!message.files?.length && (
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
        {isDisplayReaction && (
          <Box pb={0.75}>
            <Reactions messageId={message.id} reactions={message.reactions} />
          </Box>
        )}

        {/* action bar */}
        {isDisplayMessageActions && (
          <Box position="absolute" right={12} top={-20}>
            <MessageActions
              messageId={message.id}
              isStarred={message.isStarred}
              isOwner={message.user === user.id}
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
      {isShowShareMessageModal && (
        <ShareMessageModal
          isOpen={isShowShareMessageModal}
          message={message}
          onClose={() => setShowShareMessageModal(false)}
        />
      )}
      {/* delete message modal */}
      {isShowDeleteMessageModal && (
        <DeleteMessageModal
          isOpen={isShowDeleteMessageModal}
          message={message}
          onClose={() => setShowDeleteMessageModal(false)}
          onSubmit={handleDelete}
        />
      )}
      {/* user detail modal */}
      {isShowUserModal && !!userOwner && (
        <UserDetailModal
          isOpen={isShowUserModal}
          anchorEl={avatarRef.current}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          transformOrigin={{ horizontal: "left", vertical: "top" }}
          user={userOwner}
          onClose={() => setShowUserModal(false)}
        />
      )}
    </>
  );
};

export default MessageContent;
