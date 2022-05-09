import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiIcon: {
    styleOverrides: {
      root: {
        color: "inherit",
        fontSize: "inherit",
      },
    },
  },
};

export default components.MuiIcon;
