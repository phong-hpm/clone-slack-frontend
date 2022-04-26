import React, { FC, useRef, useState } from "react";

// redux store
import { useSelector } from "../../../store";

// redux selectors
import * as authSelectors from "../../../store/selectors/auth.selector";

// components
import { Box } from "@mui/system";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";

// icons
import { Edit as EditIcon, KeyboardArrowDown as KeyboardArrowDownIcon } from "@mui/icons-material";

const WorkSpaceSidebar: FC = () => {
  const user = useSelector(authSelectors.getUser);

  const anchorRef = useRef<HTMLDivElement>();

  const [isShowMenu, setShowMenu] = useState(false);

  const handleSelect = () => {
    setShowMenu(false);
  };

  const handleAddNewMessage = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Box borderBottom={1} borderColor="rgba(209, 210, 211, 0.1)" color="#d1d2d3">
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
          <KeyboardArrowDownIcon fontSize="small" />
        </Box>
        <Box>
          <IconButton color="secondary" onClick={handleAddNewMessage}>
            <EditIcon fontSize="medium" />
          </IconButton>
        </Box>
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorRef.current}
        open={isShowMenu}
        onClose={() => setShowMenu(false)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleSelect}>Profile</MenuItem>
        <MenuItem onClick={handleSelect}>My account</MenuItem>
        <MenuItem onClick={handleSelect}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default WorkSpaceSidebar;
