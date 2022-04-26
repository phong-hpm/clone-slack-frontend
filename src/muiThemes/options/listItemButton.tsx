import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiListItemButton: {
    styleOverrides: {
      root: {
        fontSize: "inherit",
        color: "inherit",

        "&.Mui-selected": {
          backgroundColor: "#1164A3",
        },
      },
    },
  },
};

export default components.MuiListItemButton;
