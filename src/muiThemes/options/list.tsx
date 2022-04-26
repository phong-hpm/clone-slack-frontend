import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiList: {
    styleOverrides: {
      root: {
        fontSize: "inherit",
        color: "inherit",
      },
    },
  },
};

export default components.MuiList;
