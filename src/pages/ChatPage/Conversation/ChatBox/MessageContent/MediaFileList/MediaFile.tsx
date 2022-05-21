import { FC, useMemo, useState } from "react";

// redux
import { useSelector } from "store";

// redux selectors
import * as channelsSelector from "store/selectors/channels.selector";

// components
import VideoPlayer from "components/MediaPlayer/VideoPlayer";
import AudioPlayer from "components/MediaPlayer/AudioPlayer";
import MediaFileDeleteModal from "./MediaFileDeleteModal";

// utils
import { color } from "utils/constants";

// hooks
import useMessageSocket from "pages/ChatPage/hooks/useMessageSocket";

// types
import { MessageFileType, UserType } from "store/slices/_types";
import { VideoPlayerDataType } from "components/MediaPlayer/VideoPlayer/_types";
import { Box, CircularProgress } from "@mui/material";
import { AudioPlayerDataType } from "components/MediaPlayer/AudioPlayer/_types";

export interface MediaFileProps {
  messageId: string;
  file: MessageFileType;
  userOwner?: UserType;
}

const MediaFile: FC<MediaFileProps> = ({ messageId, file, userOwner }) => {
  const selectedChannel = useSelector(channelsSelector.getSelectedChannel);

  const { emitRemoveMessageFile } = useMessageSocket();

  const [isShowDeleteModal, setShowDeleteModal] = useState(false);

  const videoData = useMemo<Partial<VideoPlayerDataType>>(() => {
    return {
      channelName: selectedChannel?.name,
      src: file.url,
      created: file.created,
      duration: file.duration,
      scripts: file.scripts,
      thumbnail: file.thumb,
      userOwner,
    };
  }, [file, selectedChannel, userOwner]);

  const audioData = useMemo<AudioPlayerDataType>(() => {
    return {
      url: file.url,
      wavePeaks: file.wavePeaks,
      duration: file.duration,
    };
  }, [file]);

  const handleDelete = () => {
    emitRemoveMessageFile(messageId, file.id);
    setShowDeleteModal(false);
  };

  return (
    <Box
      position="relative"
      display="flex"
      width={file.type === "audio" ? "auto" : "100%"}
      maxWidth={480}
    >
      {file.type === "audio" ? (
        <AudioPlayer
          key={file.id}
          isControls
          height={40}
          width={200}
          data={audioData}
          onDelete={() => setShowDeleteModal(true)}
        />
      ) : (
        <VideoPlayer
          key={file.id}
          data={videoData}
          ratio={file.ratio}
          style={{
            flex: "1 1 auto",
            maxWidth: 480,
            borderRadius: 8,
            overflow: "hidden",
            marginTop: 8,
            marginRight: 8,
          }}
          onDelete={() => setShowDeleteModal(true)}
        />
      )}

      {/* uploading wheel */}
      {!file.url && (
        <Box
          position="absolute"
          top={0}
          right={0}
          width={24}
          height={24}
          p={0.25}
          borderRadius="50%"
          bgcolor={color.SECONDARY_BACKGROUND}
        >
          <CircularProgress color="secondary" size={24} />
        </Box>
      )}

      <MediaFileDeleteModal
        isOpen={isShowDeleteModal}
        file={file}
        userOwner={userOwner}
        onClose={() => setShowDeleteModal(false)}
        onSubmit={handleDelete}
      />
    </Box>
  );
};

export default MediaFile;
