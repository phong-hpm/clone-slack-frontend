import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";

// redux store
import { useSelector } from "store";

// redux slices
import { UserType } from "store/slices/users.slice";
import { MessageType } from "store/slices/messages.slice";

// redux selectors
import * as authSelectors from "store/selectors/auth.selector";
import * as usersSelectors from "store/selectors/users.selector";

// components
import ReactQuill from "react-quill";
import { Delta } from "quill";
import { Avatar, Box, Chip, Link, Tooltip, Typography } from "@mui/material";
import EmojiIcon from "components/EmojiIcon";

// hooks
import useMessageSocket from "../../hooks/useMessageSocket";

// utils
import { dayFormat } from "utils/dayjs";
import { color, rgba } from "utils/constants";
import { addNecessaryFields } from "utils/message";

// images
import defaultAvatar from "assets/images/default_avatar.png";
import MessageInput from "./MessageInput";
import { updateReadonlyLinkField } from "utils/message";
import MessageActions from "./MessageActions";
import SlackIcon from "components/SlackIcon";
import ShareMessageModal from "./ShareMessageModal";
import EmojiModal from "./EmojiModal";

export interface MessageContentProps {
  userOwner?: UserType;
  message: MessageType;
}

const MessageContent: FC<MessageContentProps> = ({ userOwner, message: messageProp }) => {
  const quillRef = useRef<ReactQuill>(null);
  const anchorEmojiModalRef = useRef<HTMLDivElement>(null);

  const { emitEditMessage, emitRemoveMessage, emitReactionMessage } = useMessageSocket();

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
  const [isShowEmojiModal, setShowEmojiModal] = useState(false);

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
    if (isEditing || !quillRef.current || !message.delta.ops?.length) return;
    quillRef.current.getEditor().setContents(updateReadonlyLinkField(message.delta, true));
  }, [isEditing, message.delta]);

  // after [isEditing] state change, we should reset [isHovering] state
  // 1: when user change status to editing, should remove hovering status
  // 1: when user change status to NOT editing, should remove hovering status
  useLayoutEffect(() => setHovering(false), [isEditing]);

  if (!message.delta.ops?.length) return <></>;

  const bgcolor = isEditing
    ? "rgba(242, 199, 68, 0.2)"
    : message.isStared
    ? "rgba(242, 199, 68, 0.1)"
    : isHovering
    ? rgba(color.LIGHT, 0.1)
    : "";

  return (
    <Box
      position="relative"
      flex="1"
      bgcolor={bgcolor}
      // when user is editing, [isHovering] always have false value
      onMouseOver={() => setHovering(!isEditing)}
      onMouseLeave={() => setHovering(false)}
    >
      {message.isStared && (
        <Box display="flex" px={2.5} py={0.5}>
          <Box flexBasis={36} display="flex" justifyContent="end" mt={0.5} mr={1}>
            <SlackIcon color={color.DANGER} fontSize="small" icon="bookmark-filled" />
          </Box>

          <Link component="button" underline="hover" color={rgba(color.MAX, 0.7)}>
            <Typography variant="h5">Added to your saved items</Typography>
          </Link>
        </Box>
      )}

      <Box display="flex" px={2.5} pb={0.5}>
        <Box flexBasis={36} mt={0.5} mr={1}>
          {userOwner && <Avatar src={defaultAvatar} />}
          {!userOwner && isHovering && (
            <Typography variant="h6" align="right" color={color.MAX_SOLID}>
              {dayFormat.time(message.created)}
            </Typography>
          )}
        </Box>
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
        </Box>
      </Box>

      <Box display="flex" py={0.5} pl={8} pr={0.5}>
        {message.reactions.map((reaction) => (
          <Box key={reaction.id} mr={0.5}>
            <Chip
              clickable
              size="small"
              color={reaction.users.includes(user.id) ? "primary" : undefined}
              label={
                <Box display="flex">
                  <EmojiIcon id={reaction.id} />
                  <Typography variant="h6" sx={{ ml: 0.5 }}>
                    {reaction.count}
                  </Typography>
                </Box>
              }
              onClick={() => emitReactionMessage(message.id, reaction.id)}
            />
          </Box>
        ))}
        {!!message.reactions.length && (
          <Tooltip title="Add reaction...">
            <Chip
              ref={anchorEmojiModalRef}
              clickable
              variant="outlined"
              size="small"
              label={<SlackIcon icon="add-reaction" fontSize="medium" />}
              onClick={() => setShowEmojiModal(true)}
            />
          </Tooltip>
        )}
      </Box>

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

      <ShareMessageModal
        isOpen={isShowShareMessageModal}
        message={message}
        onClose={() => setShowShareMessageModal(false)}
        onSubmit={() => {}}
      />

      <EmojiModal
        isOpen={isShowEmojiModal}
        anchorEl={anchorEmojiModalRef.current}
        onEmojiSelect={(emoji) => emitReactionMessage(message.id, emoji.id)}
        onClose={() => setShowEmojiModal(false)}
      />
    </Box>
  );
};

export default MessageContent;
