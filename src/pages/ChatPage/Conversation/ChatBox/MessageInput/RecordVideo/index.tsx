import { FC, useContext, useEffect, useState } from "react";

// components
import { Box } from "@mui/material";
import RecordModal from "./RecordVideoModal";

// types
import { RecordStatusType } from "./_types";
import ReviewVideo from "../ReviewVideo";

// context
import InputContext from "../InputContext";

// types
import { MessageFileType } from "store/slices/_types";

export interface VideoRecordProps {
  isStart?: boolean;
  onDone: (url: string) => void;
  onClose: () => void;
}

const VideoRecord: FC<VideoRecordProps> = ({ isStart, onDone, onClose }) => {
  const { setInputFile } = useContext(InputContext);

  const [status, setStatus] = useState<RecordStatusType>("ready");
  const [file, setFile] = useState<MessageFileType | null>(null);

  const handleNext = (newFile: MessageFileType) => {
    setFile(newFile);
    setStatus("review");
  };

  const handleDoneReview = () => {
    setStatus("ready");
    if (file) setInputFile(file);
  };

  const handleRepeat = () => {
    setStatus("recording");
    setFile(null);
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
    <Box>
      <RecordModal isOpen={status === "recording"} onClose={handleClose} onNext={handleNext} />

      {file && (
        <ReviewVideo
          isOpen={status === "review"}
          file={file}
          downloadable
          onRepeat={handleRepeat}
          onThumbnail={() => {}}
          onDone={handleDoneReview}
          onClose={handleClose}
        />
      )}
    </Box>
  );
};

export default VideoRecord;
