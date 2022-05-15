import { FC, useContext, useState } from "react";

// components
import ReviewVideoModal, { ReviewVideoModalProps } from "./ReviewVideoModal";

// context
import InputContext from "../../InputContext";

// types
import { MessageFileType } from "store/slices/_types";
import SelectThumnailModal from "./SelectThumbnailModal";

export interface ReviewVideoProps extends Omit<ReviewVideoModalProps, "onDownload"> {
  file: MessageFileType;
  downloadable?: boolean;
  onRepeat?: () => void;
  onDone?: () => void;
  onSelectThumbnail?: (thumb: string) => void;
}

const ReviewVideo: FC<ReviewVideoProps> = ({ file, downloadable, onSelectThumbnail, ...props }) => {
  const [isShowThumbnailModal, setShowThumbnailModal] = useState(false);

  const handleDownload = () => {
    console.log("url");
  };

  return (
    <>
      <ReviewVideoModal
        file={file}
        {...props}
        onDownload={downloadable ? handleDownload : undefined}
        onThumbnail={() => setShowThumbnailModal(true)}
      />

      {!!file.url && (
        <SelectThumnailModal
          isOpen={isShowThumbnailModal}
          src={file.url}
          onSelect={onSelectThumbnail}
          onClose={() => setShowThumbnailModal(false)}
        />
      )}
    </>
  );
};

export default ReviewVideo;
