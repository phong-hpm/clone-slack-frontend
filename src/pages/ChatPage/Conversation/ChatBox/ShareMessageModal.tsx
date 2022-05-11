import { FC, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";

// images
import defaultAvatar from "assets/images/default_avatar.png";

// redux store
import { useSelector } from "store";

// redux selector
import * as authSelectors from "store/selectors/auth.selector";
import * as usersSelectors from "store/selectors/users.selector";

// components
import { Box, Button, Popper, Typography, TextField, Avatar } from "@mui/material";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "components/Modal";
import Status from "components/Status";

// utils
import { color } from "utils/constants";

// types
import { MessageType } from "store/slices/_types";

export interface ShareMessageModalProps {
  isOpen: boolean;
  message: MessageType;
  onClose: () => void;
  onSubmit: (name: string, desc: string) => void;
}

const ShareMessageModal: FC<ShareMessageModalProps> = ({ isOpen, message, onSubmit, onClose }) => {
  const user = useSelector(authSelectors.getUser);
  const userList = useSelector(usersSelectors.getUserList);

  const [channelName, setChannelName] = useState("");

  const handleSubmit = () => {
    onSubmit(channelName, "");
  };

  return (
    <Modal isOpen={isOpen} isCloseBtn onClose={onClose}>
      <ModalHeader>
        <Typography variant="h2">Share this message</Typography>
      </ModalHeader>
      <ModalBody>
        <Box mt={1} color={color.PRIMARY}>
          <Box>
            <Autocomplete
              disablePortal
              freeSolo
              options={userList}
              size="small"
              PopperComponent={(props) => <Popper {...props} />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  type="text"
                  color="primary"
                  placeholder="Search for channel or person"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                />
              )}
              renderOption={(liProps, { id, name, realname, isOnline }) => {
                return (
                  <li {...liProps}>
                    <Box display="flex" color={color.PRIMARY}>
                      <Box p={0.5}>
                        <Avatar sizes="small" src={defaultAvatar} />
                      </Box>
                      <Box p={0.5}>
                        <Typography fontWeight={700}>{name || "unknow"}</Typography>
                      </Box>
                      {id === user.id && (
                        <Box p={0.5}>
                          <Typography fontWeight={700}>(you)</Typography>
                        </Box>
                      )}
                      <Box p={0.5}>
                        <Status fontSize="large" isOnline={isOnline} />
                      </Box>
                      {!!realname && (
                        <Box p={0.5}>
                          <Typography>{realname}</Typography>
                        </Box>
                      )}
                    </Box>
                  </li>
                );
              }}
            />
          </Box>
        </Box>
      </ModalBody>

      <ModalFooter>
        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" color="primary" size="large">
            Copy Link
          </Button>
          <Box>
            <Button variant="outlined" color="primary" size="large" sx={{ mr: 1.5 }}>
              Save Draft
            </Button>
            <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
              Create
            </Button>
          </Box>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default ShareMessageModal;
