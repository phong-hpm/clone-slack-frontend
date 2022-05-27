import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiInputAdornment: {
    styleOverrides: {
      root: {
        color: "inherit",
        fontSize: "inherit",
      },
    },
  },
};

export default components.MuiInputAdornment;
