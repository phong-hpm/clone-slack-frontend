import { FC, useEffect, useRef, useState } from "react";

// components
import Delta from "quill-delta";
import { DeltaStatic } from "quill";
import { Box, Button, Typography, TextField } from "@mui/material";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "components/Modal";

// types
import {
  ContextLinkValueType,
  LinkCustomEventDetailType,
} from "pages/ChatPage/Conversation/ChatBox/MessageInput/_types";

const LinkEditModal: FC = () => {
  // using ref, we can update anchorEl and user before component's rendering
  // it will make sure data were available when component re-render
  // support for case user is moving mouse too fast
  const keepRef = useRef<LinkCustomEventDetailType>({});

  const [isOpen, setOpen] = useState(false);

  const textRef = useRef<HTMLInputElement>(null);
  const hrefRef = useRef<HTMLInputElement>(null);

  const [isDisabled, setDisabled] = useState(true);

  const handleClose = () => {
    keepRef.current.setFocus?.(true, keepRef.current.range?.index);
    keepRef.current = {};
    setOpen(false);
  };

  const handleOpen = (detail: LinkCustomEventDetailType) => {
    keepRef.current = detail;
    setOpen(true);
  };

  const handleChange = () => {
    setDisabled(!textRef.current?.value || !hrefRef.current?.value);
  };

  const handleSubmit = () => {
    if (isDisabled || !keepRef.current.quillReact?.getEditor() || !keepRef.current.range) return;
    let { index, length } = keepRef.current.range;
    const text = textRef.current!.value;
    const href = hrefRef.current!.value;

    // get range of old link
    if (keepRef.current.blotRange?.length) {
      index = keepRef.current.blotRange.index;
      length = keepRef.current.blotRange.length;
    }
    const linkDelta = new Delta()
      .retain(index)
      .delete(length)
      .insert(text, { link: { href, text, isEditable: true } as ContextLinkValueType });

    keepRef.current.quillReact?.getEditor().updateContents(linkDelta as unknown as DeltaStatic);
    keepRef.current.range = { index: index + text.length, length: 0 };
    handleClose();
  };

  useEffect(() => {
    const handleOpenLinkEditModal = (event: any) => {
      if (event.detail.quillReact) handleOpen(event.detail);
    };

    window.addEventListener("open-link-edit-modal", handleOpenLinkEditModal);
    return () => window.removeEventListener("open-link-edit-modal", handleOpenLinkEditModal);
  }, []);

  if (!isOpen) return <></>;

  return (
    <Modal isOpen={isOpen} isCloseBtn onClose={handleClose}>
      <ModalHeader>
        <Typography variant="h3">
          {keepRef.current.blotRange?.length ? "Edit" : "Add"} link
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Box>
          <Typography fontWeight="bold">Text</Typography>
          <Box mt={1}>
            <TextField
              inputRef={textRef}
              autoFocus
              fullWidth
              type="text"
              placeholder="Text"
              defaultValue={keepRef.current.linkValue?.text || ""}
              onChange={handleChange}
            />
          </Box>
        </Box>
        <Box mt={2.5}>
          <Typography fontWeight="bold">Link</Typography>
          <Box mt={1}>
            <TextField
              inputRef={hrefRef}
              fullWidth
              type="text"
              placeholder="Link"
              defaultValue={keepRef.current.linkValue?.href || ""}
              onChange={handleChange}
            />
          </Box>
        </Box>
      </ModalBody>

      <ModalFooter>
        <Box display="flex" justifyContent="end">
          <Box mr={2}>
            <Button variant="outlined" size="medium" onClick={handleClose}>
              cancel
            </Button>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              disabled={isDisabled}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Box>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default LinkEditModal;
