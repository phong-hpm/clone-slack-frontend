import { Theme } from "@mui/material";

// utils
import { color } from "utils/constants";

const components: Theme["components"] = {
  MuiTab: {
    defaultProps: {},
    styleOverrides: {
      root: {
        textTransform: "none",
        fontWeight: 900,

        "&.Mui-selected": {
          color: "inherit",
        },
      },
    },
  },
};

export default components.MuiTab;
