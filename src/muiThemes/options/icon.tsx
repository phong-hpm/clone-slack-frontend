import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiIcon: {
    styleOverrides: {
      root: {
        fontSize: "inherit",
        color: "inherit",
      },
    },
  },
};

export default components.MuiIcon;
