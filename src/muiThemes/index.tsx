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
import MuiPopover from "./options/popover";
import MuiSwitch from "./options/switch";
import MuiInputAdornment from "./options/inputAdornment";
import MuiAvatar from "./options/avatar";
import MuiButtonGroup from "./options/buttonGroup";
import MuiMenu from "./options/menu";
import MuiMenuItem from "./options/menuItem";
import MuiDivider from "./options/divider";
import MuiLink from "./options/link";
import MuiTooltip from "./options/tooltip";
import MuiChip from "./options/chip";
import MuiSelect from "./options/select";
import MuiSlider from "./options/slider";

// utils
import { color } from "utils/constants";

const mainOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    text: {
      primary: color.PRIMARY,
    },
  },
  typography: {
    fontFamily: "Lato, sans-serif",

    allVariants: { fontSize: "15px", lineHeight: "20px", color: "inherit" },
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
    MuiPopover,
    MuiSwitch,
    MuiAvatar,
    MuiButtonGroup,
    MuiMenu,
    MuiMenuItem,
    MuiDivider,
    MuiLink,
    MuiTooltip,
    MuiChip,
    MuiSelect,
    MuiSlider,
  },
};

export default createTheme(mainOptions);
