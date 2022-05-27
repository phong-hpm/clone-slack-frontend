import { Theme } from "@mui/material";

// utils
import { color } from "utils/constants";

const components: Theme["components"] = {
  MuiDivider: {
    styleOverrides: {
      root: {
        borderBottomWidth: 0,
        borderTopWidth: "1px",
        borderStyle: "solid",
        borderColor: color.BORDER,
      },
    },
  },
};

export default components.MuiDivider;
