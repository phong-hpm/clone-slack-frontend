import { FC, useEffect, useRef, useState } from "react";

// components
import { Box, Button, Link, Typography } from "@mui/material";

// utils
import { Modal, ModalBody, ModalFooter } from "components/Modal";

// types
import { LinkCustomEventDetailType } from "../MessageInput/_types";

const LinkDetailModal: FC = () => {
  // using ref, we can update anchorEl and user before component's rendering
  // it will make sure data were available when component re-render
  // support for case user is moving mouse too fast
  const keepRef = useRef<LinkCustomEventDetailType>({});

  const [isOpen, setOpen] = useState(false);

  const handleClose = () => {
    if (keepRef.current.setFocus) {
      keepRef.current.setFocus(true, keepRef.current.range?.index);
    }
    keepRef.current = {};
    setOpen(false);
  };

  const handleOpen = (detail: LinkCustomEventDetailType) => {
    detail.quillReact?.getEditor().blur();
    keepRef.current = detail;
    setOpen(true);
  };

  const handleEdit = () => {
    // blur quill to help EditLink input can auto focus
    keepRef.current.quillReact?.getEditor().blur();

    const customEvent = new CustomEvent("open-link-edit-modal", { detail: keepRef.current });
    window.dispatchEvent(customEvent);

    handleClose();
  };

  const handleRemove = () => {
    if (!keepRef.current.quillReact?.getEditor() || !keepRef.current.blotRange) return;
    keepRef.current.quillReact
      ?.getEditor()
      .formatText(keepRef.current.blotRange, "link", false, "user");

    handleClose();
  };

  useEffect(() => {
    const handleOpenLinkDetailModal = (event: any) => {
      if (event.detail?.anchorEl && event.detail?.quillReact) handleOpen(event.detail);
    };

    window.addEventListener("open-link-detail-modal", handleOpenLinkDetailModal);
    return () => window.removeEventListener("open-link-detail-modal", handleOpenLinkDetailModal);
  }, []);

  return (
    <Modal
      anchorEl={keepRef.current.anchorEl}
      isOpen={isOpen}
      isCloseBtn
      isArrow
      onClose={handleClose}
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      transformOrigin={{ horizontal: "center", vertical: "bottom" }}
      transformExtra={{ vertical: 16 }}
    >
      <ModalBody>
        <Box pt={3}>
          <Typography>{keepRef.current.linkValue?.text}</Typography>
          <Typography>
            <Link underline="hover">{keepRef.current.linkValue?.href}</Link>
          </Typography>
        </Box>
      </ModalBody>

      <ModalFooter>
        <Box display="flex" justifyContent="end">
          <Button variant="outlined" sx={{ mr: 2 }} onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="contained" color="error" size="medium" onClick={handleRemove}>
            Remove
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default LinkDetailModal;
