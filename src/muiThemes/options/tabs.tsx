import { Theme } from "@mui/material";

// utils
import { color } from "utils/constants";

const components: Theme["components"] = {
  MuiTabs: {
    defaultProps: {
      color: "inherit",
    },
    styleOverrides: {
      root: {
        "& .MuiTabs-indicator": {
          backgroundColor: color.SUCCESS,
        },
      },
    },
  },
};

export default components.MuiTabs;
