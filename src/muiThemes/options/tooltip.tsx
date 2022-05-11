import { Theme } from "@mui/material";

// utils
import { color, css } from "utils/constants";

const components: Theme["components"] = {
  MuiTooltip: {
    defaultProps: {
      placement: "top",
      arrow: true,
      TransitionProps: { timeout: 0 },
    },
    styleOverrides: {
      tooltip: {
        background: color.DARK,
        boxShadow: css.BOX_SHADOW,
        borderRadius: 8,
        fontSize: 13,
        padding: "8px 10px",

        "& .MuiTooltip-arrow": {
          "&:before": {
            background: color.DARK,
            boxShadow: css.BOX_SHADOW,
          },
        },
      },

      // overide by class
      popper: {
        // support for remind menu in more menu
        "&.tooltip-menu": {
          zIndex: 2100,
          marginTop: "-9px !important",

          ".MuiTooltip-tooltip": {
            width: 200,
            margin: "1px !important",
            padding: "8px 0",
            backgroundColor: color.MIN_SOLID,
          },
        },
      },
    },
    variants: [
      // not work with tooltip
    ],
  },
};

export default components.MuiTooltip;
