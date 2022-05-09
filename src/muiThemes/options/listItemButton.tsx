import { Theme } from "@mui/material";

// utils
import { color } from "../../utils/constants";

const components: Theme["components"] = {
  MuiListItemButton: {
    defaultProps: {
      disableRipple: true,
      disableTouchRipple: true,
      disableGutters: true,
    },
    styleOverrides: {
      root: {
        fontSize: "inherit",
        color: "inherit",
        transitionDuration: "0ms",

        "&.Mui-selected": {
          backgroundColor: color.HOVER_ITEM,
          "&:hover": {
            backgroundColor: color.HOVER_ITEM,
          },
        },
      },
    },
    variants: [
      {
        props: { className: "bg-hover-none" },
        style: {
          "&:hover": {
            backgroundColor: "transparent",
          },

          "&.Mui-selected": {
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent",
            },
          },

          "&.Mui-focusVisible": {
            backgroundColor: "transparent",
          },
        },
      },
    ],
  },
};

export default components.MuiListItemButton;
