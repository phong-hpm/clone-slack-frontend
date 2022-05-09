import { Theme } from "@mui/material";

// utils
import { color, css } from "../../utils/constants";

const components: Theme["components"] = {
  MuiPopover: {
    defaultProps: {
      anchorOrigin: { vertical: "top", horizontal: "center" },
      transformOrigin: { vertical: "bottom", horizontal: "center" },
      disableAutoFocus: true,
      disableEnforceFocus: true,
    },
    styleOverrides: {
      root: {
        "& .MuiPopover-paper": {
          color: color.LIGHT,
          background: color.DARK,
          boxShadow: css.BOX_SHADOW,
          borderRadius: "8px",
          overflow: "visible",

          "&::before": {
            content: '""',
            position: "absolute",
            zIndex: 2,
            bottom: 0,
            left: "50%",
            transform: "translate(-50%, 0)",
            width: "20px",
            height: "8px",
            background: color.DARK,
          },

          "&::after": {
            content: '""',
            position: "absolute",
            zIndex: 1,
            bottom: 0,
            left: "50%",
            transform: "translate(-50%, 50%) rotateZ(45deg)",
            width: "10px",
            height: "10px",
            boxShadow: css.BOX_SHADOW,
            background: color.DARK,
          },
        },
      },
    },
  } as any,
};

export default components.MuiPopover;
