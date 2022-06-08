import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// redux store
import { useDispatch, useSelector } from "store";

// redux selectors
import userSelectors from "store/selectors/user.selector";

// redux actions
import { checkEmail } from "store/actions/user/checkEmail";

// components
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";

// utils
import { color, rgba, routePaths } from "utils/constants";

// icons

const sx: Record<string, SxProps> = {
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
    bgcolor: "rgb(97, 31, 105)",
    "&:hover": { bgcolor: "rgb(97, 31, 105)" },
  },
};

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const emailVerifying = useSelector(userSelectors.getEmailVerifying);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSignUp = () => {
    if (!inputRef.current?.value) return;
    dispatch(checkEmail({ email: inputRef.current?.value }));
  };

  // after [checkEmail] api success, [emailVerifying] will be set
  // auto navigate after [emailVerifying] has value
  useEffect(() => {
    if (!emailVerifying) return;
    navigate(routePaths.CONFIRM_CODE_PAGE);
  }, [emailVerifying, navigate]);

  return (
    <Box flexGrow={1} display="flex" justifyContent="center" mt={1}>
      <Box display="flex" flexDirection="column" alignItems="center" width="100%" maxWidth={400}>
        <Box mt={3} width="100%">
          <TextField
            inputRef={inputRef}
            fullWidth
            placeholder="name@work-email.com"
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
            onClick={handleSignUp}
          >
            <Typography variant="h4">Continue</Typography>
          </Button>
        </Box>

        <Box display="flex" alignItems="start" mt={2} width="100%">
          <FormControlLabel
            control={<Checkbox sx={{ "& .MuiSvgIcon-root": { color: "rgb(0,117,255)" } }} />}
            label="It's okay to send me emails about Slack."
          />
        </Box>

        <Box display="flex" alignItems="start" mt={3} width="100%" color="rgb(97, 96, 97)">
          <Typography>
            By continuing, you're agreeing to our Customer Terms of Service, User Terms of Service,
            Privacy Policy, and Cookie Policy.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;
