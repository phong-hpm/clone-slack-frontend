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

const mainOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    text: {
      primary: "#d1d2d3",
    },
  },
  typography: {
    fontSize: 14,
    fontFamily: "Lato, sans-serif",
    htmlFontSize: (16 / 15) * 16,
    h1: { fontSize: "32px" },
    h2: { fontSize: "28px" },
    h3: { fontSize: "24px" },
    h4: { fontSize: "18px" },
    h5: { fontSize: "14px" },
    h6: { fontSize: "13px" },
  } as any,
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
  },
};

export default createTheme(mainOptions);

// font-size: 12 | 13 | 14 | 15 | 18 | 24 | 32

// title: #d1d2d3
//
