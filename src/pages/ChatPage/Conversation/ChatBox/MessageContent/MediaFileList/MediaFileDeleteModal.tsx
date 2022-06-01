import { FC, useState } from "react";

// components
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalProps } from "components/Modal";
import { Box, Button, Typography } from "@mui/material";
import ReviewVideoCard from "../../MessageInput/Review/ReviewVideoCard";
import SlackIcon from "components/SlackIcon";
import SvgFileIcon from "components/SvgFileIcon";

// utils
import { color, rgba } from "utils/constants";
import { dayFormat } from "utils/dayjs";

// types
import { MessageFileType, UserType } from "store/slices/_types";

export interface MediaFileDeleteModalProps extends ModalProps {
  file: MessageFileType;
  userOwner?: UserType;
  onSubmit?: () => void;
}

const MediaFileDeleteModal: FC<MediaFileDeleteModalProps> = ({
  file,
  userOwner,
  onClose,
  onSubmit,
  ...props
}) => {
  const [isHovering, setHovering] = useState(false);

  return (
    <Modal
      isCloseBtn
      autoWidth
      autoHeight
      className="modal-record"
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      transformOrigin={{ horizontal: "center", vertical: "bottom" }}
      transformExtra={{ vertical: 8 }}
      style={{ content: { width: "32.5rem" } }}
      onClose={onClose}
      {...props}
    >
      <ModalHeader py={1.5}>
        <Typography variant="h3">Delete clip</Typography>
      </ModalHeader>

      <ModalBody px={3} py={0}>
        <Typography>Are you sure you want to delete this clip permanently?</Typography>
        <Box
          display="flex"
          mt={2}
          p={1.5}
          border="1px solid"
          borderColor={rgba(color.PRIMARY, 0.1)}
          borderRadius={3}
          onMouseOver={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {file.type === "video" ? (
            <ReviewVideoCard file={file} size={36} />
          ) : (
            <Box
              position="relative"
              display="flex"
              alignItems="center"
              width={36}
              bgcolor="background-color: rgba(91, 179, 129, 0.2)"
              borderRadius={3}
              border="1px solid"
              borderColor={color.BORDER}
            >
              <SvgFileIcon icon="wavesurfer" />
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
              >
                <SlackIcon icon="play-filled" />
              </Box>
            </Box>
          )}
          <Box ml={2}>
            <Typography fontWeight={700} lineHeight={1} sx={{ mb: 0.5 }}>
              {file.type === "video" ? "Video" : "Audio"} clip
            </Typography>
            {isHovering ? (
              <Typography variant="h5" color={color.MAX_SOLID}>
                View <strong>Slack Clip</strong> in Slack
              </Typography>
            ) : (
              <Typography variant="h5" color={color.MAX_SOLID}>
                {userOwner?.name || ""}{" "}
                {`${dayFormat.dayO(file.createdTime)} at ${dayFormat.fullTimeA(file.createdTime)}`}
              </Typography>
            )}
          </Box>
        </Box>
      </ModalBody>

      <ModalFooter>
        <Box display="flex" justifyContent="end">
          <Button variant="outlined" size="large" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" size="large" sx={{ ml: 2 }} onClick={onSubmit}>
            Yes, Delete This Clip
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default MediaFileDeleteModal;
