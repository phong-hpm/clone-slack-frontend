import { FC } from "react";

// redux store
import { useSelector } from "store";

// redux selectors
import * as authSelectors from "store/selectors/auth.selector";

// hooks
import useAuthenication from "hooks/useAuthenication";

// components
import { Box, CircularProgress, Typography } from "@mui/material";

// utils
import { color } from "utils/constants";

export interface RouteAuthProps {}

const RouteAuth: FC<RouteAuthProps> = ({ children }) => {
  useAuthenication();
  const isAuth = useSelector(authSelectors.isAuth);

  if (isAuth) return <>{children}</>;

  return (
    <Box position="fixed" top={0} bottom={0} left={0} right={0} bgcolor={color.BG_WORK_SPACE}>
      <Box position="absolute" top="50%" left="50%" sx={{ transform: "translate(-50%, -50%)" }}>
        <Box display="flex" flexDirection="column" alignItems="center" color={color.PRIMARY}>
          <CircularProgress size={60} />
          <Typography variant="h4" fontWeight={400} sx={{ mt: 2 }}>
            Authenticating . . .
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RouteAuth;
