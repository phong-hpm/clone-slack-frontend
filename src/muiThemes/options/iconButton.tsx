import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiIconButton: {
    styleOverrides: {
      root: {
        fontSize: "inherit",
        color: "inherit",
        borderRadius: "4px",
      },
    },
  },
};

export default components.MuiIconButton;
