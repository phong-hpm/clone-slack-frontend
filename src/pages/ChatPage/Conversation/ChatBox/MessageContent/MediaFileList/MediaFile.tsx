import { FC, useMemo, useState } from "react";

// redux
import { useDispatch, useSelector } from "store";

// redux actions
import { emitRemoveMessageFile } from "store/actions/socket/messageSocket.action";

// redux selectors
import channelsSelectors from "store/selectors/channels.selector";

// components
import VideoPlayer from "components/MediaPlayer/VideoPlayer";
import Image from "components/Image";
import AudioPlayer from "components/MediaPlayer/AudioPlayer";
import MediaFileDeleteModal from "./MediaFileDeleteModal";

// utils
import { color } from "utils/constants";

// types
import { MessageFileType, UserType } from "store/slices/_types";
import { VideoPlayerDataType } from "components/MediaPlayer/VideoPlayer/_types";
import { Box, CircularProgress } from "@mui/material";
import { AudioPlayerDataType } from "components/MediaPlayer/AudioPlayer/_types";
import SelectThumbnailModal from "components/MediaPlayer/SelectThumbnailModal";

export interface MediaFileProps {
  messageId: string;
  file: MessageFileType;
  userOwner?: UserType;
}

const MediaFile: FC<MediaFileProps> = ({ messageId, file, userOwner }) => {
  const dispatch = useDispatch();

  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

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
    dispatch(emitRemoveMessageFile({ id: messageId, fileId: file.id }));
    setShowDeleteModal(false);
  };

  return (
    <Box
      position="relative"
      display="flex"
      alignItems="start"
      width={file.type === "audio" ? "auto" : "100%"}
      maxWidth={480}
    >
      {file.type === "image" && (
        <Image
          key={file.id}
          src={file.url}
          ratio={file.ratio}
          boxProps={{ mt: 1, maxWidth: 480, borderRadius: 2, overflow: "hidden" }}
        />
      )}

      {file.type === "audio" && (
        <AudioPlayer
          key={file.id}
          isControls
          height={40}
          width={200}
          data={audioData}
          onDelete={() => setShowDeleteModal(true)}
        />
      )}

      {file.type === "video" && (
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

      {isShowThumbnailModal && !!file.url && (
        <SelectThumbnailModal
          isOpen={isShowThumbnailModal}
          src={file.url}
          thumb={file.thumb}
          thumbList={file.thumbList}
          onSelect={handleEditThumbnail}
          onClose={() => setShowThumbnailModal(false)}
        />
      )}

      {isShowDeleteModal && (
        <MediaFileDeleteModal
          isOpen={isShowDeleteModal}
          file={file}
          userOwner={userOwner}
          onSubmit={handleDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </Box>
  );
};

export default MediaFile;
