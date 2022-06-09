import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";

// components
import { Box, Button, Collapse, IconButton, Link, Slide, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import SvgFileIcon from "components/SvgFileIcon";

// constants
import { color, routePaths, rgba } from "utils/constants";
import featuresConstants from "features/_features.constants";

export interface SideBarProps {
  open: boolean;
  onClose: () => void;
}

const SideBar: FC<SideBarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const [isCollapse, setCollapse] = useState(false);

  if (!open) return <></>;

  return (
    <Slide direction="left" in={open}>
      <Box
        position="fixed"
        zIndex={1500}
        top={0}
        left={0}
        display="flex"
        flexDirection="column"
        height="100vh"
        width="100%"
        bgcolor={color.LIGHT}
      >
        <Box display="flex" justifyContent="space-between" p={3}>
          <Link mr={2} height={25} onClick={() => navigate(routePaths.HOME_PAGE)}>
            <SvgFileIcon icon="slack-logo" height={25} width={100} />
          </Link>
          <IconButton size="small" onClick={onClose}>
            <SlackIcon icon="close" />
          </IconButton>
        </Box>

        <Box flexGrow={1} display="flex" flexDirection="column" px={2} overflow="auto">
          <Link
            underline="none"
            color="inherit"
            borderRadius={1}
            bgcolor={isCollapse ? "rgb(245, 244, 245)" : undefined}
            sx={{ p: 2, display: "flex" }}
            onClick={() => setCollapse(!isCollapse)}
          >
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Product
            </Typography>
            <Box className={classnames("rotate-270-360", isCollapse && "rotate")}>
              <SvgFileIcon icon="chevron-down-big-black" width={15} height={15} />
            </Box>
          </Link>
          <Collapse in={isCollapse} sx={{ minHeight: "auto !important" }} timeout={0}>
            <Box display="flex" flexDirection="column" pl={4}>
              {featuresConstants.pageHeader.navbarProductList.map((item) => {
                return (
                  <Link
                    key={item.label}
                    underline="hover"
                    color="inherit"
                    sx={{ p: 2, display: "inline-block" }}
                    onClick={() => navigate(item.to)}
                  >
                    <Typography>{item.label}</Typography>
                  </Link>
                );
              })}
            </Box>
          </Collapse>

          {featuresConstants.pageHeader.navbarList.map((item) => {
            return (
              <Link
                key={item.label}
                underline="hover"
                color="inherit"
                sx={{ p: 2, display: "inline-block" }}
                onClick={() => navigate(item.to)}
              >
                <Typography variant="h4">{item.label}</Typography>
              </Link>
            );
          })}
        </Box>

        <Box p={3} boxShadow={`${rgba(color.MAX_DARK, 0.04)} 0px -10px 12px 0px`}>
          <Button
            fullWidth
            variant="outlined"
            sx={{
              p: 2.5,
              color: "rgb(97, 31, 105)",
              borderColor: "rgb(97, 31, 105)",
              ":hover": { borderColor: "rgb(97, 31, 105)" },
            }}
            onClick={() => navigate(routePaths.SIGNIN_PAGE)}
          >
            SIGN IN
          </Button>
        </Box>
      </Box>
    </Slide>
  );
};

export default SideBar;
