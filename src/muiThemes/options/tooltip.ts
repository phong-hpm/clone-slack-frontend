import { Theme } from "@mui/material";

// utils
import { color, css } from "utils/constants";

const components: Theme["components"] = {
  MuiTooltip: {
    defaultProps: {
      placement: "top",
      arrow: true,
      TransitionProps: { timeout: 0 },
      componentsProps: {
        tooltip: { style: { marginBottom: 8, maxWidth: 200 } },
      },
      disableInteractive: true,
    },
    styleOverrides: {
      tooltip: {
        background: color.DARK,
        boxShadow: css.BOX_SHADOW,
        borderRadius: 8,
        fontSize: 13,
        padding: "8px 10px",
        textAlign: "center",

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
          zIndex: 1500,
          ".MuiTooltip-tooltip": {
            minWidth: 200,
            padding: "8px 0",
            backgroundColor: color.MIN_SOLID,

            margin: "0 !important",
            marginTop: "-8px !important",
          },
        },

        "&.auto-width": {
          ".MuiTooltip-tooltip": {
            width: "auto",
            maxWidth: "initial !important",
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
