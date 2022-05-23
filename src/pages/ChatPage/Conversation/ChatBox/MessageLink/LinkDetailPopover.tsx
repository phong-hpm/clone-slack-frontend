import { FC, useEffect, useRef, useState } from "react";

// components
import { Box, Popover, Typography } from "@mui/material";

// types
import { ContextLinkValueType } from "pages/ChatPage/Conversation/ChatBox/MessageInput/_types";

// quill-react is using javascript event to trigger action
// that why this component is working with javascript event only
const LinkDetailPopover: FC = () => {
  // using ref, we can update anchorEl and user before component's rendering
  // it will make sure data were available when component re-render
  // support for case user is moving mouse too fast
  const keepRef = useRef<{
    anchorEl: HTMLSpanElement | null;
    linkValue: ContextLinkValueType | null;
  }>({
    anchorEl: null,
    linkValue: null,
  });

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    keepRef.current.anchorEl = null;
    keepRef.current.linkValue = null;
    setOpen(false);
  };

  const handleOpen = (linkValue: ContextLinkValueType, node: HTMLSpanElement) => {
    keepRef.current.anchorEl = node;
    keepRef.current.linkValue = linkValue;
    setOpen(true);
  };

  // listen event hover link
  useEffect(() => {
    let node: HTMLSpanElement;

    const clinkHover = (e: any) => {
      const linkValue = e.value as ContextLinkValueType;
      node = e.node as HTMLAnchorElement;

      if (node && linkValue.isReadOnly) {
        handleOpen(linkValue, node);
        // add mouseleave listener for link after hovered
        node?.addEventListener("mouseleave", handleClose);
      }
    };

    window.addEventListener("link-hovered", clinkHover);
    return () => {
      node?.removeEventListener("mouseleave", handleClose);
      window.removeEventListener("link-hovered", clinkHover);
    };
  }, []);

  // make sure date and achor are available
  if (!keepRef.current.linkValue || !keepRef.current.anchorEl) return <></>;

  return (
    <Popover
      anchorEl={keepRef.current.anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{ horizontal: "center", vertical: -8 }}
      // if Popover take pointer, link mouseleave event will be trigger
      sx={{ pointerEvents: "none" }}
    >
      <Box p={1}>
        <Typography>{keepRef.current.linkValue?.url}</Typography>
      </Box>
    </Popover>
  );
};

export default LinkDetailPopover;
