import React, {
  FC,
  useMemo,
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import classnames from "classnames";

// components
import ReactModal from "react-modal";
import { Box, IconButton, PopoverOrigin, BoxProps } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import ModalBody from "./ModalBody";

// utils
import {
  computeAnchorPosition,
  computeTransformPosition,
  computeOverViewportPosition,
} from "utils/modal";

// types
import { Position, ReactModalProps } from "./_types";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import useKeyboard from "hooks/keyboard/useKeyboard";
import { eventKeys } from "utils/constants";

if (process.env.NODE_ENV !== "test") ReactModal.setAppElement("#root");

export interface ModalProps extends ReactModalProps {
  isOpen: boolean;
  isCloseBtn?: boolean;
  isCloseBtnCorner?: boolean;
  isArrow?: boolean;
  shouldCloseOnEsc?: boolean;
  shouldCloseOnOverlayClick?: boolean;
  onEnter?: () => void;
  onClose: () => void;
  anchorEl?: Element | null | undefined;
  autoWidth?: boolean;
  autoHeight?: boolean;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  transformExtra?: { horizontal?: number; vertical?: number };
  IconCloseProps?: BoxProps;
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
  onEnter,
  onClose,
  anchorOrigin,
  transformOrigin,
  transformExtra,
  children: childrenProp,
  IconCloseProps,
  ...props
}) => {
  const keepRef = useRef({ prevWidth: 0, prevHeight: 0 });

  const { handleKeyDown } = useKeyboard({
    keyDownListener: {
      [eventKeys.KEY_ENTER]: () => onEnter?.(),
    },
  });

  const [contentEl, setContentEl] = useState<HTMLDivElement>();
  const [position, setPosition] = useState<Position>();
  const [mappingChildren, setMappingChildren] = useState<typeof childrenProp>();
  const [children, setChildren] = useState<typeof childrenProp>();
  const [isBodyCanScroll, setBodyCanScroll] = useState(false);

  const style = useMemo(() => {
    const { content = {}, overlay = {} } = styleProp || {};
    const modalStyles: ReactModal.Styles = {
      content: {
        width: autoWidth ? "auto" : undefined,
        minWidth: autoWidth ? "auto" : undefined,
        height: autoHeight ? "auto" : undefined,
        minHeight: autoHeight ? "auto" : undefined,
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

  // assign prop [onCanScroll] to ModalBody in [childrenProp]
  useEffect(() => {
    if (!isOpen || !childrenProp) return;
    setMappingChildren(
      React.Children.map(childrenProp, (child) => {
        if (React.isValidElement(child) && child.type === ModalBody) {
          return React.cloneElement(child, { onCanScroll: setBodyCanScroll });
        }

        return child;
      })
    );
  }, [isOpen, childrenProp]);

  // after assigned prop [onCanScroll] to ModalBody,
  //   if [ModalBody] is scrolling, [onCanScroll] will be fired
  //   [isBodyCanScroll] state will be updated
  // now, assign prop [isUncontrolledBorder] to ModalHeader and ModalFooter in [mappingChildren]
  useEffect(() => {
    if (!isOpen || !mappingChildren) return;
    setChildren(
      React.Children.map(mappingChildren, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === ModalHeader || child.type === ModalFooter) {
            return React.cloneElement(child, { isUncontrolledBorder: isBodyCanScroll });
          }
        }

        return child;
      })
    );
  }, [isOpen, isBodyCanScroll, mappingChildren]);

  if (!isOpen) return <></>;

  return (
    <Box onKeyDown={handleKeyDown}>
      <ReactModal
        contentRef={setContentEl}
        isOpen={isOpen}
        shouldCloseOnEsc={shouldCloseOnEsc}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
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
          <Box position="absolute" zIndex="1000" top="12px" right="12px" {...IconCloseProps}>
            <IconButton onClick={onClose} sx={{ borderRadius: 1 }}>
              <SlackIcon icon="close" />
            </IconButton>
          </Box>
        )}
        {isCloseBtnCorner && (
          <Box position="absolute" zIndex="1000" top={-10} right={-10} {...IconCloseProps}>
            <IconButton color="secondary" onClick={onClose} size="medium">
              <SlackIcon fontSize="small" icon="close" />
            </IconButton>
          </Box>
        )}
      </ReactModal>
    </Box>
  );
};

export default Modal;
