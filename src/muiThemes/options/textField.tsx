import { Theme } from "@mui/material";

// utils
import { color, css } from "../../utils/constants";

const components: Theme["components"] = {
  MuiTextField: {
    styleOverrides: {
      root: {
        ".MuiInputBase-root": {
          ".MuiOutlinedInput-input": {
            height: "auto",
            padding: "7px 16px",
            lineHeight: "22px",

            "&::placeholder": {
              opacity: 0.6,
            },
          },

          ".MuiOutlinedInput-notchedOutline": {
            borderColor: color.BORDER_ITEM,
          },

          "&:hover": {
            borderColor: color.BORDER_ITEM,

            ".MuiOutlinedInput-notchedOutline": {
              borderColor: color.BORDER_ITEM,
            },
          },

          "&.Mui-focused": {
            boxShadow: css.BOX_SHADOW_ITEM,

            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
            },
          },
        },
      },
    },
  },
};

export default components.MuiTextField;
