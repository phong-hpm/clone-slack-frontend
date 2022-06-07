// store
import { useDispatch } from "store";

// redux store
import { useSelector } from "store";

// redux selector
import globalModalSelectors from "store/selectors/globalModal.selector";
import channelsSelectors from "store/selectors/channels.selector";

// redux actions
import { setOpenArchiveChannelModal } from "store/slices/globalModal.slice";

// components
import { Box, Button, Typography } from "@mui/material";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "components/Modal";

const ArchiveChannelModal = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(globalModalSelectors.isOpenArchiveChannelModal);
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  const handleSubmit = () => {
    if (!selectedChannel?.id) return;
    handleClose();
  };

  const handleClose = () => {
    dispatch(setOpenArchiveChannelModal(false));
  };

  if (!selectedChannel) return <></>;

  return (
    <Modal isOpen={isOpen} isCloseBtn onClose={handleClose} onEnter={handleSubmit}>
      <ModalHeader>
        <Typography variant="h3">Achive this channel?</Typography>
      </ModalHeader>

      <ModalBody py={0}>
        <Typography>When you archive a channel, it's archived for everyone. That means…</Typography>
        <ul style={{ marginTop: 0, paddingLeft: 20 }}>
          <li>
            <Typography lineHeight="25px">
              No one will be able to send messages to the channel
            </Typography>
          </li>
          <li>
            <Typography lineHeight="25px">
              Any apps installed in the channel will be disabled
            </Typography>
          </li>
          <li>
            <Typography lineHeight="25px">
              If there are people from other organizations in this channel, they will be removed.
              They'll still have access to the chat history.
            </Typography>
          </li>
        </ul>
        <Typography>
          You'll still be able to find the channel's contents via search. And you can always
          unarchive the channel in the future, if you'd like.
        </Typography>
      </ModalBody>

      <ModalFooter>
        <Box display="flex" justifyContent="end">
          <Button variant="outlined" size="large" sx={{ mr: 1 }} onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" size="large" color="error" onClick={handleSubmit}>
            Archive Channel
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default ArchiveChannelModal;
