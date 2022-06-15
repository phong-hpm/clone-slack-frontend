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

export interface RecordVideoProps {
  isOpen?: boolean;
  onClose: () => void;
}

const RecordVideo: FC<RecordVideoProps> = ({ isOpen, onClose }) => {
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

  const handleStartOver = () => {
    setStatus("recording");
    setFile(null);
  };

  const handleSelectThumbnail = (thumb: string) => {
    file && setFile({ ...file, thumb });
  };

  const handleUpdateThumbList = (thumbList: string[]) => {
    file && setFile({ ...file, thumb: thumbList[0], thumbList });
  };

  const handleDoneReview = () => {
    handleClose();
    file && setInputFile(file);
  };

  const handleClose = () => {
    setStatus("ready");
    onClose();
  };

  useEffect(() => {
    setStatus(isOpen ? "recording" : "ready");
    !isOpen && setFile(null);
  }, [isOpen]);

  return (
    <>
      <RecordVideoModal isOpen={status === "recording"} onClose={handleClose} onNext={handleNext} />

      {file && status === "review" && (
        <ReviewVideo
          isOpen={status === "review"}
          file={file}
          downloadable
          onStartOver={handleStartOver}
          onSelectThumbnail={handleSelectThumbnail}
          onUpdateThumbList={handleUpdateThumbList}
          onDone={handleDoneReview}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default RecordVideo;
