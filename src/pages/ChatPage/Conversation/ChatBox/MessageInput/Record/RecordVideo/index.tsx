import { FC, useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

// components
import RecordVideoModal from "./RecordVideoModal";

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

  const handleNext = (url: string, duration: number) => {
    setFile({
      id: `F-${uuid()}`,
      url,
      createdTime: Date.now(),
      type: "video",
      mineType: "video/webm",
      duration,
      ratio: 9 / 16,
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

  const handleUpdateThumbList = (thumbList: string[]) => {
    if (file) setFile({ ...file, thumb: thumbList[0], thumbList });
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
      <RecordVideoModal isOpen={status === "recording"} onClose={handleClose} onNext={handleNext} />

      {file && status === "review" && (
        <ReviewVideo
          isOpen={status === "review"}
          file={file}
          downloadable
          onStartOver={handleRepeat}
          onSelectThumbnail={handleSelectThumbnail}
          onUpdateThumbList={handleUpdateThumbList}
          onDone={handleDoneReview}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default VideoRecord;
