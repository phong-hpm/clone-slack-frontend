import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// components
import {
  Box,
  Typography,
  Link,
  Button,
  Menu,
  MenuItem,
  Divider,
  Container,
  IconButton,
} from "@mui/material";
import SideBar from "./SideBar";
import SlackIcon from "components/SlackIcon";
import SvgFileIcon from "components/SvgFileIcon";

// utils
import { getPlatform } from "utils/detectplatform";

// constants
import { color, rgba, routePaths } from "utils/constants";
import featuresConstants from "features/_features.constants";

export interface PageHeaderProps {
  isFixed?: boolean;
}

const PageHeader: FC<PageHeaderProps> = ({ isFixed: isFixedProp }) => {
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const [isHoverProduct, setHoverProduct] = useState(false);
  const [isHoverMenuProduct, setHoverMenuProduct] = useState(false);
  const [isShowSideBar, setShowSideBar] = useState(false);
  const [isFixed, setFixed] = useState(isFixedProp);

  // IntersectionObserver will catch the intersection of Header and viewport
  // to decide that header is fixed or not
  useEffect(() => {
    if (isFixedProp || !containerRef.current) return;

    const element = containerRef.current;
    const observer = new IntersectionObserver((entries) => {
      setFixed(!entries[0].isIntersecting);
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [isFixed, isFixedProp]);

  return (
    // this container Box is only using for catch InterectionObserver
    // it has to have [height]
    // when user scroll down, it still lie in the top of page, only content will be fixed
    <Box ref={containerRef} position="absolute" height={80} width="100%">
      <Box
        position={{ xs: "fixed", md: isFixed ? "fixed" : "absolute" }}
        zIndex={1500}
        top={{ xs: 0, md: isFixed ? 8 : 0 }}
        left={0}
        width="100%"
        bgcolor={{ xs: color.LIGHT, md: "transparent" }}
      >
        <Container>
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            mx={-3}
            px={3}
            py={1.5}
            borderRadius={{ xs: 0, md: isFixed ? 10 : 0 }}
            color={color.MAX_DARK}
            bgcolor={{ xs: "transparent", md: isFixed ? color.LIGHT : "transparent" }}
            boxShadow={isFixed ? `${rgba(color.DARK, 0.08)} 0px 4px 40px 0px` : "none"}
          >
            {/* left toolbar */}
            <Box display="flex" alignItems="center">
              <Link mr={2} height={25} onClick={() => navigate(routePaths.HOME_PAGE)}>
                <SvgFileIcon icon="slack-logo" height={25} width={100} />
              </Link>

              <Box sx={{ display: { xs: "none", lg: "block" } }}>
                <Link
                  ref={anchorRef}
                  underline="hover"
                  color="inherit"
                  sx={{ p: 2, display: "inline-block" }}
                  onMouseOver={() => setHoverProduct(true)}
                  onMouseLeave={() => setHoverProduct(false)}
                >
                  <Typography component="span" fontWeight={700}>
                    Product
                    <SvgFileIcon icon="chevron-down-black" height={10} style={{ marginLeft: 6 }} />
                  </Typography>
                </Link>

                {featuresConstants.pageHeader.navbarList.map((item) => {
                  return (
                    <Link
                      key={item.label}
                      underline="hover"
                      color="inherit"
                      sx={{ p: 2, display: "inline-block" }}
                      onClick={() => navigate(item.to)}
                    >
                      <Typography component="span" fontWeight={700}>
                        {item.label}
                      </Typography>
                    </Link>
                  );
                })}
              </Box>
            </Box>

            {/* right toolbar */}
            <Box display="flex" alignItems="center">
              <IconButton sx={{ p: 2 }}>
                <SvgFileIcon icon="search" fontSize={20} />
              </IconButton>
              <IconButton
                sx={{ p: 2, mr: -2, display: { lg: "none" } }}
                onClick={() => setShowSideBar(true)}
              >
                <SvgFileIcon icon="bar" fontSize={20} />
              </IconButton>
              <Link
                underline="hover"
                color="inherit"
                sx={{ p: 2, display: { xs: "none", lg: "block" } }}
                onClick={() => navigate(routePaths.SIGNIN_PAGE)}
              >
                <Typography component="span" fontWeight={700}>
                  Sign in
                </Typography>
              </Link>

              <Button
                className="purple-contained"
                size="large"
                sx={{ ml: 2, py: 1.5, display: { xs: "none", lg: "block" } }}
                onClick={() => navigate(routePaths.SIGNUP_PAGE)}
              >
                TRY FOR FREE
              </Button>
            </Box>

            {/* side bar */}
            <SideBar open={isShowSideBar} onClose={() => setShowSideBar(false)} />
          </Box>

          {/* product menu */}
          <Menu
            className="light"
            hideBackdrop
            disableScrollLock
            anchorEl={anchorRef.current}
            open={isHoverProduct || isHoverMenuProduct}
            color={color.MAX_DARK}
            MenuListProps={{
              onMouseEnter: () => setHoverMenuProduct(true),
              onMouseLeave: () => setHoverMenuProduct(false),
            }}
            PaperProps={{ style: { border: "1px solid rgb(235, 234, 235)" } }}
            sx={{ width: 0, zIndex: 1500 }}
          >
            {featuresConstants.pageHeader.navbarProductList.map((item) => {
              return (
                <MenuItem
                  key={item.label}
                  className="light"
                  onClick={() => navigate(item.to)}
                  sx={{ py: 1 }}
                  children={item.label}
                />
              );
            })}

            <Divider sx={{ borderColor: color.BORDER_GRAY }} />

            <MenuItem
              className="light"
              sx={{ py: 1 }}
              onClick={() => navigate(`${routePaths.DOWNLOAD_PAGE}/${getPlatform()}`)}
            >
              <SlackIcon icon="cloud-download" />{" "}
              <Typography component="span" ml={1}>
                Download Slack
              </Typography>
            </MenuItem>
          </Menu>
        </Container>
      </Box>
    </Box>
  );
};

export default PageHeader;
