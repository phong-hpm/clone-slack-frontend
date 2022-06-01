import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// redux store
import { useDispatch, useSelector } from "store";

// redux selectors
import userSelectors from "store/selectors/user.selector";

// components
import { Box, Link, SxProps, TextField, Typography } from "@mui/material";

// utils
import { color, rgba, routePaths } from "utils/constants";

// icons
import { confirmEmailCode } from "store/actions/user/confirmEmailCode";
import SlackIcon from "components/SlackIcon";

// images
import gmailLogo from "assets/images/gmail-logo.png";
import outlookLogo from "assets/images/outlook-logo.png";

const sx: Record<string, SxProps> = {
  TextField: {
    mr: -0.125,
    "& .MuiOutlinedInput-root": {
      "&:hover": {
        borderColor: `${rgba(color.MAX_DARK, 0.5)}`,
      },
      "&.Mui-focused": {
        borderColor: color.SELECTED_ITEM,
        boxShadow: `${color.SELECTED_ITEM} 0px 0px 0px 1px, ${rgba(
          color.SELECTED_ITEM,
          0.3
        )} 0px 0px 7px 0px`,
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderWidth: `0 !important`,
    },
  },
  Input: {
    color: color.MAX_DARK,
    fontSize: 50,
    width: 80,
    py: 1,
    borderRadius: 0,
    borderStyle: `solid`,
    borderWidth: "1px",
    borderColor: `${rgba(color.MAX_DARK, 0.5)}`,
  },
  input: { textAlign: "center" },
};

const ConfirmCode: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(userSelectors.isLoading);
  const isAuth = useSelector(userSelectors.isAuth);
  const emailVerifying = useSelector(userSelectors.getEmailVerifying);

  const inputListRef = useRef<(HTMLInputElement | null)[]>([]);

  const [isShowStatus, setShowStatus] = useState(false);

  const handleChangeValue = (key: number, value: string) => {
    if (value) {
      inputListRef.current[key + 1]?.focus();
      const val = inputListRef.current.reduce((val, node) => (val += node?.value || ""), "");
      if (emailVerifying && val.length === 6) {
        setShowStatus(true);
        dispatch(confirmEmailCode({ email: emailVerifying, verifyCode: val }));
      }
    }
  };

  useEffect(() => {
    if (!emailVerifying) {
      navigate(routePaths.SIGNIN_PAGE);
    }
  }, [emailVerifying, navigate]);

  useEffect(() => {
    if (isLoading) return;
    if (isAuth) navigate(routePaths.TEAM_PAGE);
  }, [isLoading, isAuth, navigate]);

  useEffect(() => {
    if (!isLoading && !isAuth) {
      inputListRef.current.forEach((node) => node && (node.value = ""));
      inputListRef.current[0]?.focus();
    }
  }, [isLoading, isAuth]);

  const renderInutGroup = (keys: number[]) => {
    const borderRadiusList = ["5px 0 0 5px", "0", "0 5px 5px 0"];

    return keys.map((key, index) => {
      return (
        <TextField
          inputRef={(ref) => (inputListRef.current[key] = ref)}
          autoComplete="off"
          key={key}
          InputProps={{
            sx: { ...sx.Input, borderRadius: borderRadiusList[index] },
            inputProps: { sx: sx.input, maxLength: 1 },
          }}
          sx={sx.TextField}
          onChange={(e) => handleChangeValue(key, e.target.value)}
        />
      );
    });
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="start" width="100%">
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        {/* input codes */}
        <Box display="flex" alignItems="center">
          {renderInutGroup([0, 1, 2])}
          <Typography sx={{ mx: 1 }} fontSize={15} children="—" />
          {renderInutGroup([3, 4, 5])}
        </Box>

        {/* status codes */}
        <Box
          flexGrow="1"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={3}
          width="100%"
          height={42}
          borderRadius={1}
          border="1px solid"
          borderColor={rgba(color.DANGER, isLoading ? 0 : 0.4)}
          bgcolor={rgba(color.DANGER, isLoading ? 0 : 0.1)}
          sx={{ opacity: isShowStatus && !isAuth ? 1 : 0 }}
        >
          {isLoading ? (
            <SlackIcon icon="spinner" isSpinner />
          ) : (
            <SlackIcon icon="warning" color={color.DANGER} />
          )}

          {isLoading ? (
            <Typography variant="h5" ml={1.5}>
              Checking your code...
            </Typography>
          ) : (
            <Typography variant="h5" ml={1.5}>
              That code wasn't valid. Give it another go!
            </Typography>
          )}
        </Box>

        {/* emails */}
        <Box display="flex" justifyContent="center" width="100%" mt={5}>
          <Link underline="hover" display="flex" mx={3.5} color="rgb(97, 96, 97)">
            <img src={gmailLogo} alt="gmail" style={{ width: 24, height: 24 }} />
            <Typography fontSize={14} lineHeight="24px" ml={1}>
              Open Gmail
            </Typography>
          </Link>
          <Link underline="hover" display="flex" mx={3.5} color="rgb(97, 96, 97)">
            <img src={outlookLogo} alt="gmail" style={{ width: 24, height: 24 }} />
            <Typography fontSize={14} lineHeight="24px" ml={1}>
              Open Outlook
            </Typography>
          </Link>
        </Box>

        {/* status codes */}
        <Box flexGrow="1" display="flex" justifyContent="center" alignItems="center" mt={2.5}>
          <Typography fontSize={14} color="rgb(69, 66, 69)">
            Can't find your code? Check your spam folder!
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfirmCode;
