import { useEffect, useState } from "react";

// store
import { useDispatch } from "store";

// redux store
import { useSelector } from "store";

// redux selector
import globalModalSelectors from "store/selectors/globalModal.selector";
import channelsSelectors from "store/selectors/channels.selector";

// redux actions
import {
  emitChangeToPrivatechannel,
  emitEditChannelName,
} from "store/actions/socket/channelSocket.action";
import { setOpenEditChannelNameModal } from "store/slices/globalModal.slice";

// components
import { Box, Button, Typography, TextField, InputAdornment } from "@mui/material";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "components/Modal";
import SlackIcon from "components/SlackIcon";

// utils
import { color } from "utils/constants";

const EditChanelNameModal = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(globalModalSelectors.isOpenEditChannelNameModal);
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  const [error, setError] = useState({ maxLength: false, minLength: false });
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (value.length > 80) {
      setError({ maxLength: true, minLength: false });
    }
    setValue(e.target.value);
  };

  const handleBlur = () => {
    if (!value.length) {
      setError({ maxLength: false, minLength: true });
    }
  };

  const handleSubmit = () => {
    if (!selectedChannel?.id || !value) return;
    if (selectedChannel?.type === "group_message") {
      dispatch(emitChangeToPrivatechannel({ id: selectedChannel.id, name: value }));
    } else {
      dispatch(emitEditChannelName({ id: selectedChannel.id, name: value }));
    }
    handleClose();
  };

  const handleClose = () => {
    dispatch(setOpenEditChannelNameModal(false));
  };

  useEffect(() => {
    if (selectedChannel?.name && selectedChannel?.type !== "group_message") {
      setValue(selectedChannel.name);
    }
  }, [selectedChannel?.name, selectedChannel?.type]);

  if (!selectedChannel) return <></>;

  return (
    <Modal isOpen={isOpen} isCloseBtn onClose={handleClose} onEnter={handleSubmit}>
      <ModalHeader>
        <Typography variant="h3">
          {selectedChannel.type === "group_message"
            ? "Change to private channel?"
            : "Rename this channel"}
        </Typography>
      </ModalHeader>

      <ModalBody py={1}>
        {selectedChannel.type === "group_message" && (
          <>
            <Typography>
              You're about to change this conversation with Teo and letjteo1 to a private channel.
            </Typography>
            <ul style={{ marginTop: 0, paddingLeft: 20 }}>
              <li>
                <Typography lineHeight="25px">
                  The change <strong>can't be undone</strong>
                </Typography>
              </li>
              <li>
                <Typography lineHeight="25px">
                  All messages and files in this conversation will be visible to any new members you
                  add to this channel
                </Typography>
              </li>
            </ul>
          </>
        )}

        <Box display="flex">
          <Typography fontWeight={700}>Channel name</Typography>
          {error.minLength && (
            <Typography fontWeight={700} color={color.WARM} sx={{ ml: 1 }}>
              Don't forget to name your channel.
            </Typography>
          )}
          {error.maxLength && (
            <Typography fontWeight={700} color={color.WARM} sx={{ ml: 1 }}>
              Channel names can't be longer than 80 characters.
            </Typography>
          )}
        </Box>

        <Box mt={1}>
          <TextField
            fullWidth
            autoFocus
            value={value}
            placeholder="e.g marketing"
            InputProps={{
              sx: { py: 0.5 },
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: -1 }}>
                  <SlackIcon icon="channel-pane-hash" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end" sx={{ pr: 1, ml: -1 }}>
                  {80 - value.length}
                </InputAdornment>
              ),
            }}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Box>

        <Typography variant="h5" color={color.MAX_SOLID} sx={{ mt: 1 }}>
          Names must be lowercase, without spaces or periods, and can't be longer than 80
          characters.
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
            {selectedChannel.type === "group_message" ? "Change to private" : "Save Changes"}
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default EditChanelNameModal;
