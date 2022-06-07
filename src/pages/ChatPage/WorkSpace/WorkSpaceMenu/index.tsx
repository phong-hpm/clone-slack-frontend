import { FC, useState } from "react";

// redux store
import { useSelector, useDispatch } from "store";

// redux selectors
import userSelectors from "store/selectors/user.selector";

// redux actions
import { signout } from "store/actions/user/signout";

// components
import {
  Avatar,
  Box,
  Divider,
  Link,
  Menu,
  MenuItem,
  MenuProps,
  Tooltip,
  TooltipProps,
  Typography,
} from "@mui/material";
import SvgFileIcon from "components/SvgFileIcon";
import SlackIcon from "components/SlackIcon";
import ToolsMenu from "./ToolsMenu";
import AddWorkSpaceMenu from "./AddWorkSpaceMenu";
import AdministrationMenu from "./AdministrationMenu";
import SwitchWorkSpaceMenu from "./SwitchWorkSpaceMenu";

// utils
import { color } from "utils/constants";

// images
import defaultAvatar from "assets/images/default_avatar.png";
import { setOpenCreateChannelModal } from "store/slices/globalModal.slice";

export interface WorkSpaceMenuProps extends MenuProps {}

const WorkSpaceMenu: FC<WorkSpaceMenuProps> = ({ onClose, ...props }) => {
  const dispatch = useDispatch();

  const user = useSelector(userSelectors.getUser);

  const [selected, setSelected] = useState("");

  const handleCreateChannel = () => {
    dispatch(setOpenCreateChannelModal(true));
    handleClose();
  };

  const handleClose = () => {
    onClose && onClose({}, "backdropClick");
  };

  const renderOptionTooltip = (title: string, tooltipTitle: TooltipProps["title"]) => {
    return (
      <Tooltip
        arrow={false}
        disableInteractive={false}
        classes={{ popper: "tooltip-menu" }}
        placement="right-start"
        title={tooltipTitle}
        onOpen={() => setSelected(title)}
        onClose={() => setSelected("")}
      >
        <MenuItem selected={selected === title} onClick={handleClose}>
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Typography>{title}</Typography>
            <Typography color={color.MAX_SOLID}>
              <SlackIcon icon="caret-right-unfilled" />
            </Typography>
          </Box>
        </MenuItem>
      </Tooltip>
    );
  };

  return (
    <Menu onClose={onClose} PaperProps={{ sx: { maxWidth: 300 } }} {...props}>
      <MenuItem onClick={handleClose} disabled sx={{ opacity: "1 !important" }}>
        <Box display="flex" py={1}>
          <Avatar sizes="36">
            <img src={defaultAvatar} alt="" />
          </Avatar>
          <Box ml={1.5}>
            <Typography fontWeight={900}>{user.name}</Typography>
            <Typography variant="h5" color={color.HIGH}>
              phonghoworkspace.slack.com
            </Typography>
          </Box>
        </Box>
      </MenuItem>

      <Divider />

      <MenuItem
        sx={{ py: 1, whiteSpace: "normal" }}
        onClick={() => {
          window.open("https://app.slack.com/plans/T03C86ABPDX?entry_point=team_menu_plan_info");
        }}
      >
        <Typography variant="h5">
          Your workspace is currently on the free version of Slack.
          <Link underline="hover" ml={0.5}>
            See plans
          </Link>
        </Typography>
      </MenuItem>

      <Divider />

      <MenuItem onClick={handleClose}>Invite people to {user.name}</MenuItem>
      <MenuItem onClick={handleCreateChannel}>Create a channel</MenuItem>

      <Divider />

      <MenuItem onClick={handleClose}>Preferences</MenuItem>
      {renderOptionTooltip("Administration", <AdministrationMenu userName={user.name} />)}

      <Divider />

      {renderOptionTooltip("Tools", <ToolsMenu />)}

      <Divider />

      {renderOptionTooltip("Add workspaces", <AddWorkSpaceMenu />)}
      {renderOptionTooltip("Switch workspaces", <SwitchWorkSpaceMenu />)}

      <Divider />

      <MenuItem onClick={handleClose}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography>Open the desktop app</Typography>
          <Box bgcolor={color.LIGHT} borderRadius="50%" width={18} height={18} p={0.5}>
            <SvgFileIcon icon="slack-main" width={18} height={18} />
          </Box>
        </Box>
      </MenuItem>

      <MenuItem onClick={handleClose}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography>Sign in on mobile</Typography>
          <Typography color={color.MAX_SOLID} width={26} textAlign="center">
            <SlackIcon icon="mobile" />
          </Typography>
        </Box>
      </MenuItem>

      <Divider />

      <MenuItem
        onClick={() => {
          dispatch(signout());
          handleClose();
        }}
      >
        Sign out of Phong Ho
      </MenuItem>
    </Menu>
  );
};

export default WorkSpaceMenu;
