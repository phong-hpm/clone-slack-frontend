import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        fontSize: "inherit",
        color: "inherit",
      },
    },
  },
};

export default components.MuiListItemIcon;
