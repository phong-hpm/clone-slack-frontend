import { FC, useMemo, useLayoutEffect, useState, useCallback, useRef } from "react";
import ReactModal, { Props } from "react-modal";
import classnames from "classnames";

// components
import { Box, IconButton, PopoverOrigin } from "@mui/material";
import SlackIcon from "../../components/SlackIcon";

type Position = { top: number; left: number };

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

ReactModal.setAppElement("#root");

const minSpacing = 16;

const computeAnchorPosition = (
  oldPosition: { left: number; top: number },
  anchorElement: Element,
  origin?: PopoverOrigin
) => {
  const position = { ...oldPosition };

  const { width: anchorWidth, height: anchorHeight } = anchorElement.getBoundingClientRect();
  const { horizontal = "center", vertical = "top" } = origin || {};

  // anchor X
  if (horizontal === "center") position.left += anchorWidth / 2;
  else if (horizontal === "right") position.left += anchorWidth;
  else if (horizontal === "left") position.left += 0;

  // anchor Y
  if (vertical === "center") position.top += anchorHeight / 2;
  else if (vertical === "top") position.top += 0;
  else if (vertical === "bottom") position.top += anchorHeight;

  return position;
};

const computeTransformPosition = (
  oldPosition: { left: number; top: number },
  contentElement: Element,
  origin?: PopoverOrigin,
  extraOrigin?: { horizontal?: number; vertical?: number }
) => {
  const position = { ...oldPosition };

  const { width: contentWidth, height: contentHeight } = contentElement.getBoundingClientRect();
  const { horizontal = "center", vertical = "top" } = origin || {};
  const { horizontal: horizontalExtra = 0, vertical: verticalExtra = 0 } = extraOrigin || {};

  // transform X
  if (horizontal === "center") position.left -= contentWidth / 2;
  else if (horizontal === "right") position.left -= contentWidth + horizontalExtra;
  else if (horizontal === "left") position.left += horizontalExtra;

  // transform Y
  if (vertical === "center") position.top -= contentHeight / 2;
  else if (vertical === "top") position.top += verticalExtra;
  else if (vertical === "bottom") position.top -= contentHeight + verticalExtra;

  return position;
};

const computeOverViewportPosition = (
  oldPosition: { left: number; top: number },
  contentElement: HTMLDivElement
) => {
  const position = { ...oldPosition };
  const { width: contentWidth, height: contentHeight } = contentElement.getBoundingClientRect();

  // check modal is over viewport
  // over left postion of viewport
  if (position.left < minSpacing) {
    position.left = 16;
  }

  // over top postion of viewport
  if (position.top < minSpacing) {
    position.top = 16;
  }

  // over right postion of viewport
  if (position.left + contentWidth > window.innerWidth - minSpacing) {
    position.left = window.innerWidth - minSpacing - contentWidth;
  }

  // over bottom postion of viewport
  if (position.top + contentHeight > window.innerHeight - minSpacing) {
    position.top = window.innerHeight - minSpacing - contentHeight;
  }

  return position;
};

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
