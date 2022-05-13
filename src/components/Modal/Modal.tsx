import { FC, useMemo, useLayoutEffect, useState, useCallback, useRef } from "react";
import classnames from "classnames";

// components
import ReactModal from "react-modal";
import { Box, IconButton, PopoverOrigin } from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import {
  computeAnchorPosition,
  computeTransformPosition,
  computeOverViewportPosition,
} from "utils/modal";

// types
import { Position, ReactModalProps } from "./_types";

ReactModal.setAppElement("#root");

export interface ModalProps extends ReactModalProps {
  isOpen: boolean;
  isCloseBtn?: boolean;
  isCloseBtnCorner?: boolean;
  isArrow?: boolean;
  onAfterOpen?: () => void;
  shouldCloseOnEsc?: boolean;
  shouldCloseOnOverlayClick?: boolean;
  onClose: () => void;
  anchorEl?: Element | null | undefined;
  autoWidth?: boolean;
  autoHeight?: boolean;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  transformExtra?: { horizontal?: number; vertical?: number };
  children?: JSX.Element | JSX.Element[];
}

const Modal: FC<ModalProps> = ({
  isCloseBtn,
  isCloseBtnCorner,
  isArrow,
  isOpen,
  shouldCloseOnEsc = true,
  shouldCloseOnOverlayClick = true,
  autoWidth,
  autoHeight,
  anchorEl,
  style: styleProp,
  className,
  onAfterOpen,
  onClose,
  anchorOrigin,
  transformOrigin,
  transformExtra,
  children,
  ...props
}) => {
  const keepRef = useRef({ prevWidth: 0, prevHeight: 0 });

  const [contentEl, setContentEl] = useState<HTMLDivElement>();
  const [position, setPosition] = useState<Position>();

  const style = useMemo(() => {
    const { content = {}, overlay = {} } = styleProp || {};
    const modalStyles: ReactModal.Styles = {
      content: {
        width: autoWidth ? "auto" : undefined,
        height: autoHeight ? "auto" : undefined,
        ...position,
        ...content,
      },
      overlay: { ...overlay },
    };
    return modalStyles;
  }, [autoWidth, autoHeight, position, styleProp]);

  const computePosition = useCallback(() => {
    if (!contentEl || !anchorEl) return;

    const { top, left } = anchorEl.getBoundingClientRect();
    let position = { top, left };

    position = computeAnchorPosition(position, anchorEl, anchorOrigin);
    position = computeTransformPosition(position, contentEl, transformOrigin, transformExtra);
    position = computeOverViewportPosition(position, contentEl);

    setPosition({ left: position.left, top: position.top });
  }, [transformExtra, transformOrigin, anchorOrigin, contentEl, anchorEl]);

  useLayoutEffect(() => {
    if (!contentEl) return;
    const keepState = keepRef.current;

    computePosition();

    // catch modal's resizing
    var observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      const contentRect = entry.contentRect;
      if (
        contentRect.width !== keepState.prevWidth ||
        contentRect.height !== keepState.prevHeight
      ) {
        keepState.prevWidth = contentRect.width;
        keepState.prevHeight = contentRect.height;
        computePosition();
      }
    });

    // Observe one or multiple elements
    observer.observe(contentEl);

    return () => {
      observer.unobserve(contentEl);
      keepState.prevWidth = 0;
      keepState.prevHeight = 0;
    };
  }, [contentEl, computePosition]);

  if (!isOpen) return <></>;

  return (
    <div>
      <ReactModal
        contentRef={setContentEl}
        isOpen={isOpen}
        shouldCloseOnEsc={shouldCloseOnEsc}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        onAfterOpen={onAfterOpen}
        onRequestClose={onClose}
        portalClassName="modal-portal"
        overlayClassName="modal-overlay"
        className={classnames(
          "modal-content",
          className,
          position && "modal-anchor",
          isArrow && "modal-arrow"
        )}
        style={style}
        {...props}
      >
        {children}
        {isCloseBtn && (
          <Box position="absolute" top="16px" right="16px">
            <IconButton onClick={onClose} sx={{ borderRadius: 1 }}>
              <SlackIcon icon="close" />
            </IconButton>
          </Box>
        )}
        {isCloseBtnCorner && (
          <Box position="absolute" top={-10} right={-10}>
            <IconButton color="secondary" onClick={onClose} size="medium">
              <SlackIcon fontSize="small" icon="close" />
            </IconButton>
          </Box>
        )}
      </ReactModal>
    </div>
  );
};

export default Modal;
