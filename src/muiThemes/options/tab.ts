import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiTab: {
    defaultProps: {},
    styleOverrides: {
      root: {
        textTransform: "none",
        fontWeight: 900,

        "&.Mui-selected": {
          color: "inherit",
        },
      },
    },
  },
};

export default components.MuiTab;
