import { FC, useState } from "react";

// components
import { Box, IconButton } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import ReviewVideo from "./ReviewVideo";

// types
import { MessageFileType } from "store/slices/_types";
import { color, rgba } from "utils/constants";

export interface ReviewVideoCardProps {
  file: MessageFileType;
  onRemove?: () => void;
}

const ReviewVideoCard: FC<ReviewVideoCardProps> = ({ file, onRemove }) => {
  const [isShowReviewModal, setShowReviewModal] = useState(false);
  const [isHovering, setHovering] = useState(false);

  return (
    <Box
      position="relative"
      mb={1}
      mr={1}
      onMouseOver={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Box
        display="flex"
        justifyContent="center"
        overflow="hidden"
        width={60}
        height={60}
        borderRadius={2.5}
        bgcolor={rgba(color.DARK, 0.2)}
      >
        {/* thumbnail can be updated after this file existed */}
        {file.thumb && <img src={file.thumb} alt="" style={{ height: "100%", width: "auto" }} />}
      </Box>
      <Box
        position="absolute"
        top={0}
        right={0}
        left={0}
        bottom={0}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ cursor: "pointer" }}
        onClick={() => setShowReviewModal(true)}
      >
        <SlackIcon icon="play-filled" />
      </Box>

      {/* remove button */}
      {isHovering && (
        <Box position="absolute" top={-8} right={-8}>
          <IconButton color="secondary" size="medium" onClick={onRemove}>
            <SlackIcon fontSize="small" icon="close" />
          </IconButton>
        </Box>
      )}

      <ReviewVideo
        isOpen={isShowReviewModal}
        file={file}
        onClose={() => setShowReviewModal(false)}
      />
    </Box>
  );
};

export default ReviewVideoCard;
