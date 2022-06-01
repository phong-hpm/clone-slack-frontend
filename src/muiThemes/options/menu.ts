import { Theme } from "@mui/material";

// utils
import { color, css } from "utils/constants";

const components: Theme["components"] = {
  MuiMenu: {
    styleOverrides: {
      root: {
        ".MuiPaper-root.MuiMenu-paper": {
          minWidth: "260px",
          backgroundColor: color.MIN_SOLID,
          backgroundImage: "none",
          borderRadius: "8px",
          boxShadow: css.BOX_SHADOW,

          "&::before": {
            display: "none",
          },

          "&::after": {
            display: "none",
          },
        },
      },
    },
    variants: [
      {
        props: { className: "light" },
        style: {
          ".MuiPaper-root.MuiMenu-paper": { backgroundColor: color.LIGHT },
        },
      },
    ],
  },
};

export default components.MuiMenu;
