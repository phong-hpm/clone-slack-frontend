import { FC, useContext, useMemo, useRef, useState } from "react";

// components
import {
  Divider,
  Box,
  IconButton,
  ButtonGroup,
  Menu,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";
import SlackIcon from "components/SlackIcon";

// context
import ChatBoxContext from "./InputContext";

// utils
import { color, rgba } from "utils/constants";
import EmojiModal from "../EmojiModal";
import AudioRecordModal from "./AudioRecordModal";

// types
import { MessageFileType } from "store/slices/_types";

export interface InputActionsProps {
  isShowToolbar: boolean;
  isDisabledSend: boolean;
  onSelectEmoji: (emojiNative: string) => void;
  onClickAtSign: () => void;
  onToggleToolbar: (isShow: boolean) => void;
  onCancel?: () => void;
  onSend: () => void;
  onSaveAudio?: (file: MessageFileType) => void;
}

const InputActions: FC<InputActionsProps> = ({
  isShowToolbar,
  isDisabledSend,
  onSelectEmoji,
  onClickAtSign,
  onToggleToolbar,
  onCancel,
  onSend,
  onSaveAudio,
}) => {
  const { appState, setFocus } = useContext(ChatBoxContext);

  // const audioRef = useRef<HTMLAudioElement>(null);
  // const videoRef = useRef<HTMLVideoElement>(null);
  const anchorRef = useRef<HTMLDivElement>();
  const microButtonRef = useRef<HTMLButtonElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const [isShowMenu, setShowMenu] = useState(false);
  const [isShowEmojiModal, setShowEmojiModal] = useState(false);
  const [isShowAudioModal, setShowAudioModal] = useState(false);

  // const record = async () => {
  //   return await navigator.mediaDevices.getUserMedia({
  //     audio: true,
  //     // video: true,
  //   });
  // };

  // const createRecorder = (stream: MediaStream, mimeType: string, cb: Function) => {
  //   // the stream data is stored in this array
  //   let recordedChunks: Blob[] = [];

  //   const mediaRecorder = new MediaRecorder(stream);

  //   mediaRecorder.ondataavailable = (event) => {
  //     console.log(event.data);
  //     if (event.data.size > 0) {
  //       recordedChunks.push(event.data);
  //     }
  //   };
  //   mediaRecorder.onstop = () => {
  //     cb(new Blob(recordedChunks));
  //     // saveFile(recordedChunks);
  //     recordedChunks = [];
  //   };

  //   return mediaRecorder;
  // };

  const createActionList = useMemo(
    () => [
      {
        icon: "plus",
        style: { backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: "50%" },
        action: () => {},
      },
      { isDivider: true },
      { icon: "video", action: () => {} },
      { icon: "microphone", action: () => setShowAudioModal(true), ref: microButtonRef },
      { isDivider: true },
      { icon: "emoji", action: () => setShowEmojiModal(true), ref: emojiButtonRef },
      { icon: "mentions", action: onClickAtSign },
    ],
    [onClickAtSign]
  );

  const editActionList = useMemo(
    () => [{ icon: "emoji", action: () => {}, isDivider: false, style: {}, ref: undefined }],
    []
  );

  const actionList = useMemo(() => {
    return appState.isEditMode ? editActionList : createActionList;
  }, [appState.isEditMode, createActionList, editActionList]);

  return (
    <Box display="flex" p={0.75} onClick={() => setFocus(true)}>
      {/* <audio ref={audioRef} />
      <video ref={videoRef} /> */}

      {/* actions group */}
      <Box flex="1" display="flex" py={0.5} color={color.HIGH}>
        {actionList.map(({ isDivider, icon, style, action, ref }, index) => {
          return isDivider ? (
            <Box key={index} px={0.5} py={0.25} display="flex">
              <Divider flexItem orientation="vertical" />
            </Box>
          ) : (
            <Box key={index} mx={0.5}>
              <IconButton
                ref={ref}
                size="small"
                sx={{ borderRadius: 1, ...style }}
                onClick={action}
              >
                <SlackIcon icon={icon!} fontSize="large" />
              </IconButton>
            </Box>
          );
        })}

        <Box mx={0.5} position="relative">
          <IconButton
            size="small"
            sx={{ borderRadius: 1 }}
            onClick={() => onToggleToolbar(!isShowToolbar)}
          >
            <SlackIcon icon="formatting" fontSize="large" />
          </IconButton>
          {isShowToolbar && (
            <Box
              position="absolute"
              height="1.5px"
              width="80%"
              margin="10%"
              bottom="-1px"
              borderRadius="1px"
              bgcolor={color.HIGH}
            />
          )}
        </Box>
      </Box>

      {/* Send group */}
      <Box ref={anchorRef} flex="0" display="flex" color={rgba(color.LIGHT, 0.7)}>
        {appState.isEditMode ? (
          <>
            <Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={onCancel}>
              cancel
            </Button>
            <Button variant="contained" size="small" onClick={onSend}>
              Save
            </Button>
          </>
        ) : (
          <ButtonGroup
            variant={isDisabledSend ? "outlined" : "contained"}
            disabled
            sx={{ ":disabled": { backgroundColor: "stranparent" } }}
          >
            <IconButton
              size="large"
              sx={{ borderRadius: 1 }}
              onClick={onSend}
              disabled={isDisabledSend}
            >
              <SlackIcon icon="send-filled" fontSize="medium" />
            </IconButton>

            <Box py={0.75} display="flex">
              <Divider flexItem orientation="vertical" />
            </Box>

            <IconButton
              size="large"
              sx={{ borderRadius: 1, paddingLeft: 0.5, paddingRight: 0.5 }}
              disabled={isDisabledSend}
              onClick={() => setShowMenu(true)}
            >
              <SlackIcon icon="chevron-down" fontSize="medium" />
            </IconButton>
          </ButtonGroup>
        )}
      </Box>

      <Menu
        variant="menu"
        open={isShowMenu}
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => setShowMenu(false)}
      >
        <MenuItem disabled>
          <Typography variant="h5" color={color.HIGH}>
            Schedule message
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => {}}>Monday at 9:00 AM</MenuItem>

        <Divider />

        <MenuItem onClick={() => {}}>Custom time</MenuItem>
      </Menu>

      <EmojiModal
        isOpen={isShowEmojiModal}
        anchorEl={emojiButtonRef.current}
        onEmojiSelect={(emoji) => onSelectEmoji(emoji.native)}
        onClose={() => setShowEmojiModal(false)}
      />

      <AudioRecordModal
        isOpen={isShowAudioModal}
        anchorEl={microButtonRef.current}
        onClose={() => setShowAudioModal(false)}
      />
    </Box>
  );
};

export default InputActions;
