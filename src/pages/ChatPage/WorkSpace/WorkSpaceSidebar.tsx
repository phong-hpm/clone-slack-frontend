import React, { FC, useRef, useState } from "react";

// redux store
import { useSelector } from "store";

// redux selectors
import userSelectors from "store/selectors/user.selector";

// components
import { Box, IconButton, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import WorkSpaceMenu from "./WorkSpaceMenu";

// utils
import { color } from "utils/constants";

const WorkSpaceSidebar: FC = () => {
  const user = useSelector(userSelectors.getUser);

  const anchorRef = useRef<HTMLDivElement>();

  const [isShowMenu, setShowMenu] = useState(false);

  const handleAddNewMessage = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Box borderBottom={1} borderColor={color.BORDER} color={color.PRIMARY}>
      <Box
        ref={anchorRef}
        display="flex"
        px={2}
        py={1}
        onClick={() => setShowMenu(true)}
        sx={{ cursor: "pointer" }}
      >
        <Box flex="1" display="flex" alignItems="center">
          <Typography variant="h4">{user.name}</Typography>
          <SlackIcon icon="chevron-down" />
        </Box>
        <Box>
          <IconButton color="secondary" onClick={handleAddNewMessage}>
            <SlackIcon icon="compose" fontSize="large" />
          </IconButton>
        </Box>
      </Box>

      {/* Menu actions */}
      <WorkSpaceMenu
        anchorEl={anchorRef.current}
        open={isShowMenu}
        onClose={() => setShowMenu(false)}
      />
    </Box>
  );
};

export default WorkSpaceSidebar;
