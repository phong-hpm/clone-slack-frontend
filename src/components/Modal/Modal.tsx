import { FC, useMemo, useLayoutEffect, useState, useCallback, useRef } from "react";
import ReactModal, { Props } from "react-modal";
import classnames from "classnames";

// components
import { Box, IconButton, PopoverOrigin } from "@mui/material";
import SlackIcon from "../../components/SlackIcon";

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
  isArrow?: boolean;
  onAfterOpen?: () => void;
  onClose: () => void;
  anchorEl?: Element | null | undefined;
  autoWidth?: boolean;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  transformExtra?: { horizontal?: number; vertical?: number };
  children?: JSX.Element | JSX.Element[];
}

ReactModal.setAppElement("#root");

const minSpacing = 16;

const Modal: FC<ModalProps> = ({
  isCloseBtn,
  isArrow,
  isOpen,
  autoWidth,
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

  const [contentEL, setContentEL] = useState<HTMLDivElement>();
  const [position, setPosition] = useState<{ top: string | number; left: string | number }>();

  const style = useMemo(() => {
    const { content = {}, overlay = {} } = styleProp || {};
    const modalStyles: ReactModal.Styles = {
      content: { ...content, ...position, width: autoWidth ? "auto" : undefined },
      overlay: { ...overlay },
    };
    return modalStyles;
  }, [autoWidth, position, styleProp]);

  const computePosition = useCallback(() => {
    if (!contentEL || !anchorEl) return;

    const maxRight = window.innerWidth;
    const maxBottom = window.innerHeight;

    const {
      top,
      left,
      width: anchorWidth,
      height: anchorHeight,
    } = anchorEl.getBoundingClientRect();
    const { width: contentWidth, height: contentHeight } = contentEL.getBoundingClientRect();
    let leftPos = left;
    let topPos = top;

    const { horizontal = "center", vertical = "bottom" } = transformOrigin || {};
    const { horizontal: horizontalExtra = 0, vertical: verticalExtra = 0 } = transformExtra || {};

    // transform X
    if (horizontal === "center") leftPos = left - contentWidth / 2;
    else if (horizontal === "right") leftPos = left - contentWidth - horizontalExtra;
    else if (horizontal === "left") leftPos = left + horizontalExtra;

    // transform Y
    if (vertical === "center") topPos = top - contentHeight / 2;
    else if (vertical === "top") topPos = top + verticalExtra;
    else if (vertical === "bottom") topPos = top - contentHeight - verticalExtra;

    const { horizontal: anchorHorizontal = "center", vertical: anchorVertical = "top" } =
      anchorOrigin || {};

    // anchor X
    if (anchorHorizontal === "center") leftPos += anchorWidth / 2;
    else if (anchorHorizontal === "right") leftPos += anchorWidth;
    else if (anchorHorizontal === "left") leftPos += 0;

    // anchor Y
    if (anchorVertical === "center") topPos += anchorHeight / 2;
    else if (anchorVertical === "top") topPos += 0;
    else if (anchorVertical === "bottom") topPos += anchorHeight;

    // // check modal is over viewport
    if (leftPos < minSpacing) leftPos = 16;
    if (topPos < minSpacing) topPos = 16;
    if (leftPos + contentWidth > maxRight - minSpacing)
      leftPos = maxRight - minSpacing - contentWidth;
    if (topPos + contentHeight > maxBottom - minSpacing)
      topPos = maxBottom - minSpacing - contentHeight;

    setPosition({ left: leftPos, top: topPos });
  }, [transformExtra, transformOrigin, anchorOrigin, contentEL, anchorEl]);

  useLayoutEffect(() => {
    if (!contentEL) return;
    computePosition();

    // catch modal's resizing
    var observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      const contentRect = entry.contentRect;
      if (
        contentRect.width !== keepRef.current.prevWidth ||
        contentRect.height !== keepRef.current.prevHeight
      ) {
        keepRef.current.prevWidth = contentRect.width;
        keepRef.current.prevHeight = contentRect.height;
        computePosition();
      }
    });

    // Observe one or multiple elements
    observer.observe(contentEL);

    return () => observer.unobserve(contentEL);
  }, [contentEL, computePosition]);

  if (!isOpen) return <></>;

  return (
    <div>
      <ReactModal
        contentRef={setContentEL}
        isOpen={isOpen}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
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
      </ReactModal>
    </div>
  );
};

export default Modal;
