import { FC, useState } from "react";

// components
import ReviewVideoModal, { ReviewVideoModalProps } from "./ReviewVideoModal";

// types
import { MessageFileType } from "store/slices/_types";
import SelectThumnailModal from "../../../../../../../components/MediaPlayer/SelectThumbnailModal";

export interface ReviewVideoProps extends Omit<ReviewVideoModalProps, "onDownload"> {
  file: MessageFileType;
  downloadable?: boolean;
  onRepeat?: () => void;
  onDone?: () => void;
  onSelectThumbnail?: (thumb: string) => void;
  onUpdateThumbList?: (thumbList: string[]) => void;
}

const ReviewVideo: FC<ReviewVideoProps> = ({
  file,
  downloadable,
  onSelectThumbnail,
  onUpdateThumbList,
  ...props
}) => {
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
        onUpdateThumbList={onUpdateThumbList}
        onThumbnail={() => setShowThumbnailModal(true)}
      />

      {!!file.url && (
        <SelectThumnailModal
          isOpen={isShowThumbnailModal}
          src={file.url}
          thumb={file.thumb}
          thumbList={file.thumbList}
          onSelect={onSelectThumbnail}
          onClose={() => setShowThumbnailModal(false)}
        />
      )}
    </>
  );
};

export default ReviewVideo;
