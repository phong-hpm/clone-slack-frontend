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
import { createThumbnails } from "utils/videoRecorder";

export interface VideoRecordProps {
  isStart?: boolean;
  onClose: () => void;
}

const VideoRecord: FC<VideoRecordProps> = ({ isStart, onClose }) => {
  const { setInputFile, updateInputFile } = useContext(InputContext);

  const [status, setStatus] = useState<RecordStatusType>("ready");
  const [file, setFile] = useState<MessageFileType | null>(null);

  const handleNext = (chunks: Blob[], duration: number) => {
    const blob = new Blob(chunks);
    setFile({
      id: `F-${uuid()}`,
      url: URL.createObjectURL(blob),
      created: Date.now(),
      fileType: "webm",
      type: "video",
      size: blob.size,
      mineType: "video/webm",
      duration,
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
    if (file) {
      // we have to set input file to context before update thumbnail,
      //    it will make sure that ReviewVideoCardwill get new input file
      setInputFile(file);

      // after set input file to context, we will update thumb for it
      // if user selected a thumb before, file.thumb will have value
      if (!file.thumb) {
        // create default thumbnail for record
        createThumbnails({ src: file.url }).then((thumbs) => {
          if (!thumbs?.length) return;
          updateInputFile({ id: file.id, thumb: thumbs[0] });
        });
      }
    }
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
