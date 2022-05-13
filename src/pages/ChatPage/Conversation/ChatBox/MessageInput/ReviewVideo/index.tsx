import { FC, useContext, useState } from "react";

// components
import ReviewVideoModal, { ReviewVideoModalProps } from "./ReviewVideoModal";

// context
import InputContext from "../InputContext";

// types
import { MessageFileType } from "store/slices/_types";
import SelectThumnailModal from "./SelectThumbnailModal";

export interface ReviewVideoProps extends Omit<ReviewVideoModalProps, "onDownload"> {
  file: MessageFileType;
  downloadable?: boolean;
  onRepeat?: () => void;
  onDone?: () => void;
}

const ReviewVideo: FC<ReviewVideoProps> = ({ file, downloadable, ...props }) => {
  const { updateInputFile } = useContext(InputContext);

  const [isShowThumbnailModal, setShowThumbnailModal] = useState(false);

  const handleSelectThumbnail = (thumb: string) => {
    if (file.id) updateInputFile({ id: file.id, thumb });
  };

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
          onSelect={handleSelectThumbnail}
          onClose={() => setShowThumbnailModal(false)}
        />
      )}
    </>
  );
};

export default ReviewVideo;
