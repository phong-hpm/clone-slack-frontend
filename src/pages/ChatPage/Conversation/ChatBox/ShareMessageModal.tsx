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
import MessageInput from "./MessageInput";

export interface ShareMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, desc: string) => void;
}

const ShareMessageModal: FC<ShareMessageModalProps> = ({ isOpen, onSubmit, onClose }) => {
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
            renderOption={(liProps, { id, name, realname, isOnline, avatar }) => {
              return (
                <li {...liProps}>
                  <Box display="flex" color={color.PRIMARY}>
                    <Box p={0.5}>
                      <Avatar sizes="small" src={avatar}>
                        <img src={defaultAvatar} alt="" />
                      </Avatar>
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
        <Box mt={2}>
          <MessageInput mode="custom" placeHolder="Add a message, if you'd like." />
        </Box>
      </ModalBody>

      <ModalFooter>
        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" size="large">
            Copy Link
          </Button>
          <Box>
            <Button variant="outlined" size="large" sx={{ mr: 1.5 }}>
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
