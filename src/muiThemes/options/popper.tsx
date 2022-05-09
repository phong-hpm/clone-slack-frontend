import { Theme } from "@mui/material";

// utils
import { color, css } from "../../utils/constants";

const components: Theme["components"] = {
  MuiPopper: {
    styleOverrides: {
      backgroundColor: color.MIN_SOLID,
      root: {
        ".MuiPaper-root": {
          boxShadow: css.BOX_SHADOW,
        },

        ".MuiAutocomplete-listbox": {
          backgroundImage: "none",
          backgroundColor: color.MIN_SOLID,

          ".MuiAutocomplete-option": {
            color: color.HIGH,
            padding: "4px 16px",

            "&.Mui-focused": {
              backgroundColor: color.SELECTED_ITEM,
            },

            ".label": {
              color: color.PRIMARY,
            },

            ".desc": {
              color: color.HIGH,
            },
          },
        },
      },
    },
  } as any,
};

export default components.MuiPopper;
