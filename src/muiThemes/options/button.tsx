import { Theme } from "@mui/material";

// utils
import { color, rgba } from "utils/constants";

const components: Theme["components"] = {
  MuiButton: {
    styleOverrides: {
      root: {
        color: "inherit",
        fontSize: "inherit",
        fontWeight: 900,
        textTransform: "initial",
        transitionDuration: "0ms",
        boxShadow: " none",
        minWidth: "auto",
      },
    },
    variants: [
      {
        props: { color: "primary" },
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
      {
        props: { color: "error" },
        style: {
          color: color.PRIMARY,
          backgroundColor: color.DANGER,
        },
      },
      {
        props: { variant: "text" },
        style: {
          color: color.PRIMARY,
          backgroundColor: "transparent",
          borderColor: "transparent",

          "&:hover": {
            backgroundColor: rgba(color.MAX, 0.04),
            borderColor: rgba(color.MAX, 0.04),
          },

          "&:disabled": {
            backgroundColor: color.LOW_SOLID,
            color: rgba(color.PRIMARY, 0.75),
          },
        },
      },
      {
        props: { variant: "outlined" },
        style: {
          color: color.PRIMARY,
          backgroundColor: "transparent",
          borderColor: color.BORDER_ITEM,

          "&:hover": {
            backgroundColor: rgba(color.MAX, 0.04),
            borderColor: color.BORDER_ITEM,
          },

          "&:disabled": {
            backgroundColor: color.LOW_SOLID,
            color: rgba(color.PRIMARY, 0.75),
          },
        },
      },
      {
        props: { size: "small" },
        style: {
          fontSize: "13px",
          height: "28px",
        },
      },
      {
        props: { size: "large" },
        style: {
          paddingLeft: 12,
          paddingRight: 12,
        },
      },
    ],
  },
};

export default components.MuiButton;
