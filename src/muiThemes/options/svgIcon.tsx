import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiSvgIcon: {
    styleOverrides: {
      root: {
        // fontSize: "20px",
        color: "inherit",
      },
    },
  },
};

export default components.MuiSvgIcon;
