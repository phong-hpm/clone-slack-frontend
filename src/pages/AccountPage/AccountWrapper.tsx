import { FC, useMemo } from "react";
import { useLocation, useNavigate, Link as RouteLink } from "react-router-dom";

// stores
import { useSelector } from "store";

// redux selector
import userSelectors from "store/selectors/user.selector";

// components
import { Box, Link, Typography } from "@mui/material";
import SvgFileIcon from "components/SvgFileIcon";

// utils
import { color, routePaths } from "utils/constants";

const AccountWrapper: FC = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const emailVerifying = useSelector(userSelectors.getEmailVerifying);

  const title = useMemo(() => {
    if (pathname === routePaths.SIGNIN_PAGE) return "Sign in to Slack";
    if (pathname === routePaths.SIGNUP_PAGE) return "First, enter your email";
    if (pathname === routePaths.CONFIRM_CODE_PAGE) return "Check your email for a code";
    return "Welcome back! You look nice today.";
  }, [pathname]);

  const description = useMemo(() => {
    if (pathname === routePaths.SIGNIN_PAGE || pathname === routePaths.SIGNUP_PAGE) {
      return (
        <>
          We suggest using the <strong>email address you use at work.</strong>
        </>
      );
    }

    if (pathname === routePaths.CONFIRM_CODE_PAGE)
      return (
        <>
          We've sent a 6-character code to <strong>{emailVerifying}.</strong> The code expires
          shortly, so please enter it soon.
        </>
      );

    return "Choose a workspace below to get back to working with your team.";
  }, [pathname, emailVerifying]);

  const titleSize = pathname === routePaths.TEAM_PAGE ? "32px" : "48px";
  const descriptionSize = pathname === routePaths.TEAM_PAGE ? "15px" : "18px";

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      color={color.MAX_DARK}
    >
      {/* header */}
      <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" pt={6} pb={5} width="100%">
        <Box />
        <Box display="flex" justifyContent="center" height={40}>
          <RouteLink to={routePaths.HOME_PAGE}>
            <SvgFileIcon icon="slack-logo" style={{ height: 34, width: "auto" }} />
          </RouteLink>
        </Box>

        {pathname === routePaths.SIGNIN_PAGE && (
          <Box display="flex" flexDirection="column" alignItems="end" pr={5}>
            <Typography variant="h5" color="rgb(97, 96, 97)">
              New to Slack?
            </Typography>

            <Link
              underline="hover"
              color={color.SELECTED_ITEM}
              onClick={() => navigate(routePaths.SIGNUP_PAGE)}
            >
              <Typography variant="h5" fontWeight={700}>
                Create an account
              </Typography>
            </Link>
          </Box>
        )}
      </Box>

      {/* title */}
      <Box display="flex" flexDirection="column" alignItems="center" maxWidth={700}>
        <Typography
          fontFamily="Larsseit, sans-serif"
          fontSize={titleSize}
          lineHeight={titleSize}
          fontWeight={900}
          mb={1.5}
          children={title}
        />
        <Typography
          fontSize={descriptionSize}
          lineHeight={descriptionSize}
          fontWeight={400}
          color="rgb(69, 66, 69)"
          textAlign="center"
          children={description}
        />
      </Box>

      {/* body */}
      <Box flexGrow={1} display="flex" width="100%" maxWidth={600}>
        {children}
      </Box>

      {/* Footer */}
      <Box display="flex" justifyContent="center" my={4}>
        <Link underline="hover" display="flex" mx={1} color="rgb(105, 105, 105)">
          {`Privacy & Terms`}
        </Link>
        <Link underline="hover" display="flex" mx={1} color="rgb(105, 105, 105)">
          {`Contact Us`}
        </Link>
      </Box>
    </Box>
  );
};

export default AccountWrapper;
