import { FC, useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

// components
import RecordModal from "./RecordVideoModal";

// types
import { RecordStatusType } from "./_types";
import ReviewVideo from "../../Review/ReviewVideo";

// context
import InputContext from "../../InputContext";

// types
import { MessageFileType } from "store/slices/_types";

export interface VideoRecordProps {
  isStart?: boolean;
  onClose: () => void;
}

const VideoRecord: FC<VideoRecordProps> = ({ isStart, onClose }) => {
  const { setInputFile } = useContext(InputContext);

  const [status, setStatus] = useState<RecordStatusType>("ready");
  const [file, setFile] = useState<MessageFileType | null>(null);

  const handleNext = (chunks: Blob[], thumb: string, duration: number) => {
    const blob = new Blob(chunks, { type: "video/webm" });
    setFile({
      id: `F-${uuid()}`,
      url: URL.createObjectURL(blob),
      created: Date.now(),
      type: "video",
      mineType: "video/webm",
      size: blob.size,
      duration,
      thumb,
    });
    setStatus("review");
  };

  const handleRepeat = () => {
    setStatus("recording");
    setFile(null);
  };

  const handleSelectThumbnail = (thumb: string) => {
    if (file) setFile({ ...file, thumb });
  };

  const handleDoneReview = () => {
    handleClose();
    if (file) setInputFile(file);
  };

  const handleClose = () => {
    setStatus("ready");
    onClose();
  };

  useEffect(() => {
    setStatus(isStart ? "recording" : "ready");
    if (!isStart) setFile(null);
  }, [isStart]);

  return (
    <>
      <RecordModal isOpen={status === "recording"} onClose={handleClose} onNext={handleNext} />

      {file && (
        <ReviewVideo
          isOpen={status === "review"}
          file={file}
          downloadable
          onRepeat={handleRepeat}
          onSelectThumbnail={handleSelectThumbnail}
          onDone={handleDoneReview}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default VideoRecord;
