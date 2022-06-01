import { FC, useCallback, useEffect, useRef, useState } from "react";

// images
import defaultAvatarLarge from "assets/images/default_avatar_large.png";

// redux
import { useSelector } from "store";

// redux selectors
import channelUsersSelectors from "store/selectors/channelUsers.selector";

// components
import { Avatar, Box, Button, Typography } from "@mui/material";
import Status from "components/Status";
import { Modal, ModalBody, ModalFooter } from "components/Modal";

// types
import { UserType } from "store/slices/_types";

// quill-mention is using javascript event to trigger action
// that why this component is working with javascript event only
const MentionDetailModal: FC = () => {
  const channelUserList = useSelector(channelUsersSelectors.getChannelUserList);

  // using ref, we can update anchorEl and user before component's rendering
  // it will make sure data were available when component re-render
  // support for case user is moving mouse too fast
  const keepRef = useRef<{ anchorEl: HTMLSpanElement | null; user: UserType | null }>({
    anchorEl: null,
    user: null,
  });

  const [isOpen, setOpen] = useState(false);

  const handleClose = () => {
    keepRef.current.anchorEl = null;
    keepRef.current.user = null;
    setOpen(false);
  };

  const handleOpen = useCallback(
    (id: string, node: HTMLSpanElement) => {
      const user = channelUserList.find((usr) => usr.id === id);
      if (!user) return;
      keepRef.current.anchorEl = node;
      keepRef.current.user = user;
      setOpen(true);
    },
    [channelUserList]
  );

  // handle click event
  useEffect(() => {
    const mentionClicked = (e: any) => {
      const { id, isEditable } = e.value as UserType & { isEditable: "true" | "false" };
      const node = e.event.path[0] as HTMLSpanElement;

      if (node && isEditable !== "true") handleOpen(id, node);
    };

    // listening event from quill-mention
    window.addEventListener("mention-clicked", mentionClicked);
    return () => window.removeEventListener("mention-clicked", mentionClicked);
  }, [handleOpen]);

  // make sure date and achor are available
  if (!keepRef.current.user || !keepRef.current.anchorEl) return <></>;

  return (
    <Modal
      autoWidth
      anchorEl={keepRef.current.anchorEl}
      isOpen={isOpen}
      onClose={handleClose}
      anchorOrigin={{ horizontal: "right", vertical: "center" }}
      transformOrigin={{ horizontal: "left", vertical: "center" }}
      transformExtra={{ horizontal: 8 }}
      style={{ content: { overflow: "hidden" } }}
    >
      <ModalBody p={0}>
        <Box>
          <Avatar sizes="300" src={keepRef.current.user.avatar}>
            <img src={defaultAvatarLarge} alt="" />
          </Avatar>
        </Box>
        <Box px={3} pt={3} display="flex" alignItems="center">
          <Box mr={0.5}>
            <Typography variant="h3">{keepRef.current.user.name}</Typography>
          </Box>
          <Typography>
            <Status isOnline={keepRef.current.user.isOnline} />
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

export default MentionDetailModal;
