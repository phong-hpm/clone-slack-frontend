import { Theme } from "@mui/material";

// utils
import { color, rgba } from "utils/constants";

const components: Theme["components"] = {
  MuiButton: {
    defaultProps: {
      color: "inherit",
    },
    styleOverrides: {
      root: {
        color: "inherit",
        fontSize: "inherit",
        fontWeight: 900,
        textTransform: "initial",
        transitionDuration: "0ms",
        boxShadow: " none",
        minWidth: "auto",
        padding: "5px 10px",
      },
    },
    variants: [
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
            backgroundColor: "transparent",
            color: rgba(color.PRIMARY, 0.3),
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
          padding: "2px 4px",
        },
      },
      {
        props: { size: "medium" },
        style: {
          padding: "5px 10px",
        },
      },
      {
        props: { size: "large" },
        style: {
          padding: "8px 16px",
        },
      },
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
        props: { className: "purple-outlined" },
        style: {
          color: "rgb(97, 31, 105)",
          borderColor: "rgb(97, 31, 105)",
          backgroundColor: "transparent",
          ":hover": { color: color.LIGHT, backgroundColor: "rgb(74, 21, 75)" },
        },
      },
      {
        props: { className: "purple-contained" },
        style: {
          color: color.LIGHT,
          backgroundColor: "rgb(97, 31, 105)",
          ":hover": { backgroundColor: "rgb(74, 21, 75)" },
        },
      },
      {
        props: { className: "light-outlined" },
        style: {
          color: color.LIGHT,
          borderColor: color.LIGHT,
          backgroundColor: "transparent",
          ":hover": { borderColor: color.LIGHT, backgroundColor: "transparent" },
        },
      },
      {
        props: { className: "light-contained" },
        style: {
          color: "rgb(97, 31, 105)",
          backgroundColor: color.LIGHT,
          ":hover": { backgroundColor: color.LIGHT },
        },
      },
    ],
  },
};

export default components.MuiButton;
