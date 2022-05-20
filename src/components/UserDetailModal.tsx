import { FC } from "react";

// images
import defaultAvatarLarge from "assets/images/default_avatar_large.png";

// components
import { Avatar, Box, Button, Typography } from "@mui/material";
import Status from "components/Status";
import { Modal, ModalBody, ModalFooter, ModalProps } from "components/Modal";

// types
import { UserType } from "store/slices/_types";

export interface UserDetailModalProps extends ModalProps {
  user: UserType;
}

const UserDetailModal: FC<UserDetailModalProps> = ({ user, ...props }) => {
  return (
    <Modal
      autoWidth
      anchorOrigin={{ horizontal: "right", vertical: "center" }}
      transformOrigin={{ horizontal: "left", vertical: "center" }}
      transformExtra={{ horizontal: 8 }}
      {...props}
    >
      <ModalBody p={0}>
        <Box>
          <Avatar sizes="300" src={defaultAvatarLarge} />
        </Box>
        <Box px={3} pt={3} display="flex" alignItems="center">
          <Box mr={0.5}>
            <Typography variant="h3">{user.name}</Typography>
          </Box>
          <Typography>
            <Status isOnline={user.isOnline} />
          </Typography>
        </Box>
      </ModalBody>

      <ModalFooter>
        <Box display="flex" justifyContent="end">
          <Button variant="outlined" sx={{ mr: 2 }} onClick={() => {}}>
            Set Status
          </Button>
          <Button variant="contained" color="error" size="medium" onClick={() => {}}>
            Edit Profile
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default UserDetailModal;
