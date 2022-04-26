import { ThemeOptions } from "@mui/material";
import createTheme from "@mui/material/styles/createTheme";

// options
import MuiButton from "./options/button";
import MuiTextField from "./options/textField";
import MuiAutocomplete from "./options/autocomplete";
import MuiPopper from "./options/popper";
import MuiSwitch from "./options/switch";
import MuiInputAdornment from "./options/inputAdornment";

const mainOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    text: {
      primary: "#d1d2d3",
    },
  },
  typography: {
    fontSize: 14,
    htmlFontSize: (16 / 15) * 16,
    h1: {
      fontSize: "32px",
    },
    h2: {
      fontSize: "28px",
    },
    h3: {
      fontSize: "24px",
    },
    h4: {
      fontSize: "18px",
    },
    h5: {
      fontSize: "14px",
    },
    h6: {
      fontSize: "13px",
    },
  } as any,
  components: {
    MuiButton,
    MuiTextField,
    MuiAutocomplete,
    MuiInputAdornment,
    MuiPopper,
    MuiSwitch,
  },
};

export default createTheme(mainOptions);

// font-size: 12 | 13 | 14 | 15 | 18 | 24 | 32

// title: #d1d2d3
//
