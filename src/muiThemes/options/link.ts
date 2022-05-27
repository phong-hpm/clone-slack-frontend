import { Theme } from "@mui/material";

// utils
import { color } from "utils/constants";

const components: Theme["components"] = {
  MuiLink: {
    styleOverrides: {
      root: {
        color: color.HIGHLIGHT,
        fontSize: "inherit",
        cursor: "pointer",
      },
    },
  },
};

export default components.MuiLink;
