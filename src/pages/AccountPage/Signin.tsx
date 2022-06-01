import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGoogleLogin } from "react-google-login";

// redux store
import { useDispatch } from "store";

// redux actions
import { checkEmail } from "store/actions/user/checkEmail";

// components
import { Box, Button, Divider, Link, SxProps, TextField, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import SvgFileIcon from "components/SvgFileIcon";

// utils
import { color, rgba, routePaths } from "utils/constants";

const sx: Record<string, SxProps> = {
  loginGoogleBtn: {
    p: 1,
    borderWidth: 2,
    borderColor: "rgb(66, 133, 244)",
    "&:hover": { borderColor: "rgb(66, 133, 244)" },
  },
  loginAppleBtn: {
    p: 1,
    borderWidth: 2,
    borderColor: color.MAX_DARK,
    "&:hover": { borderColor: color.MAX_DARK },
  },
  emailTextField: {
    "&.MuiTextField-root, &.MuiTextField-root:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: rgba(color.MAX_DARK, 0.3),
      },
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
      },
    },
  },
  emailInput: {
    color: color.MAX_DARK,
    py: 0.5,
    fontSize: 18,
    lineHeight: "24px",
  },
  loginEmailBtn: {
    py: 1.25,
    bgcolor: "rgb(74, 21, 75)",
    "&:hover": { bgcolor: "rgb(74, 21, 75)" },
  },
};

const Signin = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const { signIn } = useGoogleLogin({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
    cookiePolicy: "single_host_origin",
    uxMode: "redirect",
    scope: "profile",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSignin = () => {
    dispatch(checkEmail({ email: inputRef.current?.value || "" })).then((res) => {
      if (res.type === checkEmail.fulfilled.type) {
        navigate(routePaths.CONFIRM_CODE_PAGE);
      }
    });
  };

  // login by Google account hadn't supported yet from server
  useEffect(() => {
    let currentURL = window.location.href;
    const searches = new URLSearchParams(currentURL);
    const idToken = searches.get("id_token");
    if (idToken)
      setTimeout(() => {
        alert(`id_token: ${idToken}`);
      }, 100);
  }, [params]);

  return (
    <Box flexGrow={1} display="flex" justifyContent="center" mt={4}>
      <Box display="flex" flexDirection="column" alignItems="center" width="100%" maxWidth={400}>
        <Button variant="outlined" fullWidth sx={sx.loginGoogleBtn} onClick={signIn}>
          <SvgFileIcon icon="google-logo" width={18} height={18} />
          <Typography variant="h4" ml={1.5} color="rgb(66, 133, 244)">
            Sign in with Google
          </Typography>
        </Button>

        <Box mt={2} width="100%">
          <Button variant="outlined" fullWidth sx={sx.loginAppleBtn}>
            <SvgFileIcon icon="apple-logo" width={18} height={18} />
            <Typography variant="h4" ml={1.5} color={color.MAX_DARK}>
              Sign in with Apple
            </Typography>
          </Button>
        </Box>

        <Box position="relative" display="flex" justifyContent="center" mt={3} width="100%">
          <Typography px={2.5} color={color.DARK} bgcolor={color.LIGHT}>
            OR
          </Typography>

          <Box position="absolute" top="50%" zIndex={-1} width="100%">
            <Divider sx={{ width: "100%", borderColor: color.BORDER_GRAY }} />
          </Box>
        </Box>

        <Box mt={3} width="100%">
          <TextField
            inputRef={inputRef}
            fullWidth
            placeholder="name@work-email.com"
            defaultValue={"phonghophamminh@gmail.com"}
            InputProps={{ sx: sx.emailInput }}
            sx={sx.emailTextField}
          />
        </Box>

        <Box mt={2.5} width="100%">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={sx.loginEmailBtn}
            onClick={handleSignin}
          >
            <Typography variant="h4">Sign In with Email</Typography>
          </Button>
        </Box>

        <Box
          display="flex"
          alignItems="start"
          mt={2.5}
          px={3}
          py={1.5}
          bgcolor={rgba(color.MAX_DARK, 0.05)}
          borderRadius={2}
          color="rgb(97, 96, 97)"
        >
          <Box mt={0}>
            <SlackIcon icon="sparkles" fontSize="medium" />
          </Box>
          <Typography sx={{ pl: 1.5 }}>
            We'll email you a magic code for a password-free sign in. Or you can
            <Link underline="hover" color={color.SELECTED_ITEM} fontWeight={700} sx={{ ml: 0.5 }}>
              sign in manually instead.
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Signin;
