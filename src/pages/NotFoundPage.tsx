import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// components
import { Box, Typography } from "@mui/material";
import PageHeader from "features/PageHeader";
import SvgFileIcon from "components/SvgFileIcon";

// utils
import { color, routePaths } from "utils/constants";

const pathList = Object.values(routePaths);

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname && !pathList.includes(pathname)) {
      navigate(routePaths.HOME_PAGE);
    }
  }, [pathname, navigate]);

  if (!pathList.includes(pathname)) return <></>;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100vh"
      bgcolor={color.BG_WORK_SPACE}
    >
      <PageHeader isFixed />
      <Box width={300} pt={10}>
        <Box display="flex" flexDirection="column" alignItems="center" color={color.PRIMARY}>
          <SvgFileIcon
            className="rotate-animation"
            icon="setting"
            fill={color.LOW_SOLID}
            style={{ width: 150, animationDuration: "8s" }}
          />
          <Box height={100} width="100%" mt={-5} textAlign="right">
            <SvgFileIcon
              className="rotate-animation"
              icon="setting"
              fill={color.LOW_SOLID}
              style={{
                marginLeft: "auto",
                width: 100,
                animationDirection: "reverse",
                animationDuration: "5s",
              }}
            />
          </Box>
          <Typography variant="h3" fontWeight={400} sx={{ mt: 5 }}>
            This page is under
          </Typography>
          <Typography variant="h2" sx={{ mt: 2 }}>
            DEVELOPMENT
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
