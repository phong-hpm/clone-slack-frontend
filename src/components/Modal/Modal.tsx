import { FC } from "react";
import ReactModal, { Props } from "react-modal";

// components
import { Box, IconButton } from "@mui/material";

// icons
import { Close as CloseIcon } from "@mui/icons-material";

export interface ModalProps
  extends Pick<
    Props,
    | "style"
    | "portalClassName"
    | "className"
    | "overlayClassName"
    | "onAfterOpen"
    | "onAfterClose"
    | "overlayRef"
    | "contentRef"
    | "id"
  > {
  isOpen: boolean;
  isCloseBtn?: boolean;
  onClose: () => void;
  children?: JSX.Element | JSX.Element[];
}

ReactModal.setAppElement("#root");

const Modal: FC<ModalProps> = ({ isCloseBtn, isOpen, onClose, children, ...props }) => {
  return (
    <div>
      <ReactModal
        isOpen={isOpen}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
        onRequestClose={() => onClose()}
        portalClassName="modal-portal"
        overlayClassName="modal-overlay"
        className="modal-content"
        {...props}
      >
        {children}
        {isCloseBtn && (
          <Box position="absolute" top="20px" right="20px">
            <IconButton onClick={onClose}>
              <CloseIcon fontSize="medium" />
            </IconButton>
          </Box>
        )}
      </ReactModal>
    </div>
  );
};

export default Modal;
