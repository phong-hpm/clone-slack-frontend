import { FC } from "react";

// redux store
import { useSelector } from "store";

// redux selectors
import channelUsersSelectors from "store/selectors/channelUsers.selector";

// components
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalProps } from "components/Modal";
import { Box, Button, Typography } from "@mui/material";
import MessageContent from ".";

// utils
import { color, rgba } from "utils/constants";

// types
import { MessageType } from "store/slices/_types";

export interface DeleteMessageModalProps extends ModalProps {
  message: MessageType;
  onSubmit?: () => void;
}

const DeleteMessageModal: FC<DeleteMessageModalProps> = ({
  message,
  onClose,
  onSubmit,
  ...props
}) => {
  const userOwner = useSelector(channelUsersSelectors.getChannelUserById(message.user));

  const handleSubmit = () => {
    onClose && onClose();
    onSubmit && onSubmit();
  };

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
        <Typography variant="h3">Delete message</Typography>
      </ModalHeader>

      <ModalBody>
        <Typography>
          Are you sure you want to delete this message? This cannot be undone.
        </Typography>
        <Box
          display="flex"
          mt={2}
          px={1.5}
          py={0.75}
          border="1px solid"
          borderColor={rgba(color.PRIMARY, 0.1)}
          borderRadius={1}
        >
          <MessageContent isReadOnly message={message} userOwner={userOwner} />
        </Box>
      </ModalBody>

      <ModalFooter>
        <Box display="flex" justifyContent="end">
          <Button variant="outlined" size="large" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            size="large"
            sx={{ ml: 2 }}
            onClick={handleSubmit}
          >
            Delete
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteMessageModal;
