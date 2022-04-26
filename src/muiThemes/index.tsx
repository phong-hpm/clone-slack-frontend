import { ThemeOptions } from "@mui/material";
import createTheme from "@mui/material/styles/createTheme";

// options
import MuiButton from "./options/button";
import MuiIconButton from "./options/iconButton";
import MuiIcon from "./options/icon";
import MuiSvgIcon from "./options/svgIcon";
import MuiList from "./options/list";
import MuiListItemButton from "./options/listItemButton";
import MuiListItemIcon from "./options/listItemIcon";
import MuiTextField from "./options/textField";
import MuiAutocomplete from "./options/autocomplete";
import MuiPopper from "./options/popper";
import MuiSwitch from "./options/switch";
import MuiInputAdornment from "./options/inputAdornment";
import MuiAvatar from "./options/avatar";

const mainOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    text: {
      primary: "#d1d2d3",
    },
  },
  typography: {
    // fontSize: 14,
    // htmlFontSize: (16 / 15) * 16,

    fontFamily: "Lato, sans-serif",

    allVariants: { fontSize: "15px", lineHeight: "22px" },
    h1: { fontSize: "32px" },
    h2: { fontSize: "28px", lineHeight: "34px", fontWeight: 900 },
    h3: { fontSize: "22px", lineHeight: "30px", fontWeight: 900 },
    h4: { fontSize: "18px", lineHeight: "24px", fontWeight: 900 },
    h5: { fontSize: "13px", lineHeight: "18px", fontWeight: 400 },
    h6: { fontSize: "12px", lineHeight: "17px", fontWeight: 400 },
  },
  components: {
    MuiButton,
    MuiIconButton,
    MuiIcon,
    MuiSvgIcon,
    MuiList,
    MuiListItemButton,
    MuiListItemIcon,
    MuiTextField,
    MuiAutocomplete,
    MuiInputAdornment,
    MuiPopper,
    MuiSwitch,
    MuiAvatar,
  },
};

export default createTheme(mainOptions);

// font-size: 12 | 13 | 14 | 15 | 18 | 24 | 32

// title: #d1d2d3
//
