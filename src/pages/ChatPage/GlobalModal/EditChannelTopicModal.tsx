import { useEffect, useState } from "react";

// store
import { useDispatch } from "store";

// redux store
import { useSelector } from "store";

// redux selector
import globalModalSelectors from "store/selectors/globalModal.selector";
import channelsSelectors from "store/selectors/channels.selector";

// redux actions
import { emitEditChannelOptionalFields } from "store/actions/socket/channelSocket.action";
import { setOpenEditChannelTopicModal } from "store/slices/globalModal.slice";

// components
import { Box, Button, Typography, TextField } from "@mui/material";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "components/Modal";

// utils
import { color } from "utils/constants";

const EditChannelTopicModal = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(globalModalSelectors.isOpenEditChannelTopicModal);
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  const [value, setValue] = useState("");

  const handleSubmit = () => {
    /* istanbul ignore next */
    if (!selectedChannel?.id || !value) return;
    dispatch(emitEditChannelOptionalFields({ id: selectedChannel.id, topic: value }));
    handleClose();
  };

  const handleClose = () => {
    dispatch(setOpenEditChannelTopicModal(false));
  };

  useEffect(() => {
    if (selectedChannel?.topic) setValue(selectedChannel.topic);
  }, [selectedChannel?.topic]);

  if (!selectedChannel) return <></>;

  return (
    <Modal isOpen={isOpen} isCloseBtn onClose={handleClose} onEnter={handleSubmit}>
      <ModalHeader>
        <Typography variant="h3">Edit topic</Typography>
      </ModalHeader>

      <ModalBody py={1}>
        <TextField
          fullWidth
          autoFocus
          multiline
          defaultValue={selectedChannel?.topic}
          rows={5}
          placeholder="Add a topic"
          InputProps={{ sx: { p: 0 } }}
          onChange={(e) => setValue(e.target.value)}
        />
        <Typography variant="h5" color={color.MAX_SOLID} sx={{ mt: 1 }}>
          Let people know what <strong>#{selectedChannel.name}</strong> is focused on right now (ex.
          a project milestone). Topics are always visible in the header.
        </Typography>
      </ModalBody>

      <ModalFooter>
        <Box display="flex" justifyContent="end">
          <Button variant="outlined" size="large" sx={{ mr: 1 }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            color="primary"
            disabled={!value}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default EditChannelTopicModal;
