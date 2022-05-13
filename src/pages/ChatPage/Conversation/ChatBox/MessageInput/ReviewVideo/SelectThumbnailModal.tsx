import { FC, useEffect, useRef, useState } from "react";

// components
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalProps } from "components/Modal";
import { Box, Button, Typography } from "@mui/material";
import Image from "components/Image";

// utils
import { createThumbnails } from "utils/videoRecorder";
import { css } from "utils/constants";

export interface SelectThumnailModalProps extends ModalProps {
  src: string;
  onSelect: (url: string) => void;
}

const SelectThumnailModal: FC<SelectThumnailModalProps> = ({
  isOpen,
  src,
  onSelect,
  onClose,
  ...props
}) => {
  const keepRef = useRef({ isOpen: false });

  const [selected, setSelected] = useState("");
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  const handleSelect = () => {
    onSelect(selected);
    onClose();
  };

  useEffect(() => {
    if (!src || !isOpen) return;
    createThumbnails({ src }).then((thumbs) => {
      // this callback can be fired after component was unmounted
      // check isOpen in keepRef will prevent updating state
      if (!keepRef.current.isOpen || !thumbs?.length) return;
      setSelected(thumbs[0]);
      setThumbnails(thumbs);
    });
  }, [src, isOpen]);

  // keep isOpen value in ref
  useEffect(() => {
    keepRef.current.isOpen = isOpen;
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      isCloseBtn
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      transformOrigin={{ horizontal: "center", vertical: "bottom" }}
      transformExtra={{ vertical: 8 }}
      style={{ content: { maxWidth: 520 } }}
      onClose={onClose}
      {...props}
    >
      <ModalHeader>
        <Typography variant="h3">Select thumbnail</Typography>
      </ModalHeader>

      <ModalBody>
        <Box mb={4} overflow="hidden" borderRadius={2}>
          <Image src={selected} ratio={9 / 16} />
        </Box>

        <Box display="flex" overflow="hidden" borderRadius={2} sx={{ boxShadow: css.BOX_SHADOW }}>
          {thumbnails.map((thumbnail, index) => (
            <Box
              key={index}
              flex="1"
              sx={{ cursor: "pointer" }}
              onClick={() => setSelected(thumbnail)}
            >
              <Image src={thumbnail} ratio={9 / 16} />
            </Box>
          ))}
        </Box>
      </ModalBody>

      <ModalFooter>
        <Box display="flex" justifyContent="end">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ ml: 2 }}
            onClick={handleSelect}
          >
            Select
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default SelectThumnailModal;
