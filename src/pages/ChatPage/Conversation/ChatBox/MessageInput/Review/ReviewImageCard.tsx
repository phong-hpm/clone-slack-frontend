import { FC, useState } from "react";

// components
import { Box, BoxProps, IconButton } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import Image from "components/Image";
import ReviewImageModal from "./ReviewImageModal";

// types
import { MessageFileType } from "store/slices/_types";
import { color, rgba } from "utils/constants";

export interface ReviewImageCardProps {
  src: string;
  isReadOnly?: boolean;
  size?: number;
  boxProps?: BoxProps;
  onRemove?: () => void;
}

const ReviewImageCard: FC<ReviewImageCardProps> = ({
  src,
  isReadOnly,
  size = 60,
  boxProps,
  onRemove,
}) => {
  const [isShowReviewModal, setShowReviewModal] = useState(false);
  const [isHovering, setHovering] = useState(false);

  return (
    <Box
      position="relative"
      onMouseOver={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      {...boxProps}
    >
      <Box
        display="flex"
        justifyContent="center"
        overflow="hidden"
        width={size}
        height={size}
        borderRadius={2.5}
        bgcolor={rgba(color.DARK, 0.2)}
        sx={{ cursor: "pointer" }}
        onClick={() => !isReadOnly && setShowReviewModal(true)}
      >
        <Image src={src} alt="" style={{ height: "100%", width: "auto" }} />
      </Box>

      {/* remove button */}
      {isHovering && !isReadOnly && (
        <Box position="absolute" top={-8} right={-8}>
          <IconButton color="secondary" size="medium" onClick={onRemove}>
            <SlackIcon fontSize="small" icon="close" />
          </IconButton>
        </Box>
      )}

      {isShowReviewModal && (
        <ReviewImageModal
          isOpen={isShowReviewModal}
          url={src}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </Box>
  );
};

export default ReviewImageCard;
