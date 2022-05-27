import { Theme } from "@mui/material";

// utils
import { color, rgba } from "utils/constants";

const components: Theme["components"] = {
  MuiButtonGroup: {
    styleOverrides: {
      root: {
        fontSize: "inherit",
        fontWeight: 900,
        textTransform: "initial",
        transitionDuration: "0ms",
        boxShadow: "none",
      },
    },
    variants: [
      {
        props: { variant: "contained", color: "primary" },
        style: {
          backgroundColor: color.SUCCESS,
          color: color.LIGHT,

          "&:hover": {
            backgroundColor: "#148567",
          },

          "&:disabled": {
            backgroundColor: color.LOW_SOLID,
            color: rgba(color.PRIMARY, 0.75),
          },
        },
      },
    ],
  },
};

export default components.MuiButtonGroup;
