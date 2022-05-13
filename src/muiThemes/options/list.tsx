import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiList: {
    styleOverrides: {
      root: {
        "&.MuiMenu-list": {
          color: "inherit",
          fontSize: "inherit",
        },
      },
    },
  },
};

export default components.MuiList;
