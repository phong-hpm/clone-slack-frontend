import { FC, useMemo, useState } from "react";

// redux
import { useSelector } from "store";

// redux selectors
import channelsSelectors from "store/selectors/channels.selector";

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
import SelectThumnailModal from "components/MediaPlayer/SelectThumbnailModal";

export interface MediaFileProps {
  messageId: string;
  file: MessageFileType;
  userOwner?: UserType;
}

const MediaFile: FC<MediaFileProps> = ({ messageId, file, userOwner }) => {
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  const { emitRemoveMessageFile } = useMessageSocket();

  const [isShowDeleteModal, setShowDeleteModal] = useState(false);
  const [isShowThumbnailModal, setShowThumbnailModal] = useState(false);

  const videoData = useMemo<Partial<VideoPlayerDataType>>(
    () => ({
      channelName: selectedChannel?.name,
      src: file.url,
      createdTime: file.createdTime,
      duration: file.duration,
      scripts: file.scripts,
      thumbnail: file.thumb,
      status: file.status,
      userOwner,
    }),
    [file, selectedChannel, userOwner]
  );

  const audioData = useMemo<AudioPlayerDataType>(
    () => ({ src: file.url, wavePeaks: file.wavePeaks, duration: file.duration }),
    [file]
  );

  const handleEditThumbnail = () => {
    setShowThumbnailModal(false);
  };

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
          onEditThumbnail={() => setShowThumbnailModal(true)}
          onDelete={() => setShowDeleteModal(true)}
        />
      )}

      {/* uploading wheel */}
      {file.status === "uploading" && (
        <Box
          position="absolute"
          top={0}
          right={0}
          width={24}
          height={24}
          p={0.25}
          borderRadius="50%"
          bgcolor={color.MAX_DARK}
        >
          <CircularProgress color="secondary" size={24} />
        </Box>
      )}

      {file.url && (
        <SelectThumnailModal
          isOpen={isShowThumbnailModal}
          src={file.url}
          thumb={file.thumb}
          thumbList={file.thumbList}
          onSelect={handleEditThumbnail}
          onClose={() => setShowThumbnailModal(false)}
        />
      )}

      <MediaFileDeleteModal
        isOpen={isShowDeleteModal}
        file={file}
        userOwner={userOwner}
        onSubmit={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </Box>
  );
};

export default MediaFile;
