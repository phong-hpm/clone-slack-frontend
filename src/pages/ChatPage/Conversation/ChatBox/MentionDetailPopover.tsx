import { FC, useLayoutEffect, useState, useRef, useCallback } from "react";

// images
import defaultAvatar from "assets/images/default_avatar.png";

// redux
import { useSelector } from "store";

// redux slices
import { UserType } from "store/slices/users.slice";

// redux selectors
import * as userSelectors from "store/selectors/users.selector";

// components
import { Avatar, Box, Popover, Typography } from "@mui/material";
import Status from "components/Status";

// quill-mention is using javascript event to trigger action
// that why this component is working with javascript event only
const MentionDetailPopover: FC = () => {
  const userList = useSelector(userSelectors.getUserList);

  // using ref, we can update anchorEl and user before component's rendering
  // it will make sure data were available when component re-render
  // support for case user is moving mouse too fast
  const keepRef = useRef<{ anchorEl: HTMLSpanElement | null; user: UserType | null }>({
    anchorEl: null,
    user: null,
  });

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    keepRef.current.anchorEl = null;
    keepRef.current.user = null;
    setOpen(false);
  };

  const handleOpen = useCallback(
    (id: string, node: HTMLSpanElement) => {
      const user = userList.find((usr) => usr.id === id);
      if (!user) return;
      keepRef.current.anchorEl = node;
      keepRef.current.user = user;
      setOpen(true);
    },
    [userList]
  );

  // handle mouseenter and mouseleave event
  useLayoutEffect(() => {
    let node: HTMLSpanElement;

    const mentionHovered = (e: any) => {
      const { id } = e.value as UserType;
      node = e.event.path[0] as HTMLSpanElement;

      if (node) {
        handleOpen(id, node);
        // add mouseleave listener for link after hovered
        node?.addEventListener("mouseleave", handleClose);
      }
    };

    // listening event from quill-mention
    window.addEventListener("mention-hovered", mentionHovered);
    return () => {
      node?.removeEventListener("mouseleave", handleClose);
      window.removeEventListener("mention-hovered", mentionHovered);
    };
  }, [handleOpen]);

  // handle click event
  useLayoutEffect(() => {
    const mentionClicked = () => {
      const isReadOnly = keepRef.current.anchorEl?.dataset["isReadOnly"] === "true";
      if (isReadOnly) handleClose();
    };

    // listening event from quill-mention
    window.addEventListener("mention-clicked", mentionClicked);
    return () => window.removeEventListener("mention-clicked", mentionClicked);
  }, []);

  // make sure date and achor are available
  if (!keepRef.current.user || !keepRef.current.anchorEl) return <></>;

  return (
    <Popover
      anchorEl={keepRef.current.anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{ horizontal: "center", vertical: -8 }}
      // if Popover take pointer, mention mouseleave event will be trigger
      sx={{ pointerEvents: "none" }}
    >
      <Box p={1} display="flex">
        <Box p={0.5}>
          <Avatar sizes="small" src={defaultAvatar} />
        </Box>
        <Box p={0.5}>
          <Typography>{keepRef.current.user?.name || "unknow"}</Typography>
        </Box>
        <Box p={0.5}>
          <Status isOnline={keepRef.current.user.isOnline} />
        </Box>
        {!!keepRef.current.user?.realname && (
          <Box p={0.5}>
            <Typography>{keepRef.current.user.realname}</Typography>
          </Box>
        )}
      </Box>
    </Popover>
  );
};

export default MentionDetailPopover;
