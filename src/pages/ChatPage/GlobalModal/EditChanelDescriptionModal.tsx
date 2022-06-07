import { useState, useEffect } from "react";

// store
import { useDispatch } from "store";

// redux store
import { useSelector } from "store";

// redux selector
import globalModalSelectors from "store/selectors/globalModal.selector";
import channelsSelectors from "store/selectors/channels.selector";

// redux actions
import { emitEditChannelOptionalFields } from "store/actions/socket/channelSocket.action";
import { setOpenEditChannelDescriptionModal } from "store/slices/globalModal.slice";

// components
import { Box, Button, Typography, TextField } from "@mui/material";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "components/Modal";

// utils
import { color } from "utils/constants";

const EditChanelDescriptionModal = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(globalModalSelectors.isOpenEditChannelDescriptionModal);
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!selectedChannel?.id || !value) return;
    dispatch(emitEditChannelOptionalFields({ id: selectedChannel.id, desc: value }));
    handleClose();
  };

  const handleClose = () => {
    dispatch(setOpenEditChannelDescriptionModal(false));
  };

  useEffect(() => {
    if (selectedChannel?.desc) setValue(selectedChannel.desc);
  }, [selectedChannel?.desc]);

  return (
    <Modal isOpen={isOpen} isCloseBtn onClose={handleClose} onEnter={handleSubmit}>
      <ModalHeader>
        <Typography variant="h3">Edit description</Typography>
      </ModalHeader>

      <ModalBody py={1}>
        <TextField
          fullWidth
          autoFocus
          multiline
          defaultValue={selectedChannel?.desc}
          rows={5}
          placeholder="Add a description"
          InputProps={{ sx: { p: 0 } }}
          onChange={(e) => setValue(e.target.value)}
        />
        <Typography variant="h5" color={color.MAX_SOLID} sx={{ mt: 1 }}>
          Let people know what this channel is for.
        </Typography>
      </ModalBody>

      <ModalFooter>
        <Box display="flex" justifyContent="end">
          <Button variant="outlined" sx={{ mr: 1 }} onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" disabled={!value} onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default EditChanelDescriptionModal;
