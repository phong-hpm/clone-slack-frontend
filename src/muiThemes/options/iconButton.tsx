import { Theme } from "@mui/material";

// utils
import { color, rgba } from "utils/constants";

declare module "@mui/material/IconButton" {
  interface IconButtonPropsSizeOverrides {
    inherit: true;
  }
}

const components: Theme["components"] = {
  MuiIconButton: {
    defaultProps: {
      size: "inherit",
    },
    styleOverrides: {
      root: {
        fontSize: "inherit",
        color: "inherit",
        padding: "5px",
        opacity: 1,

        "&.Mui-disabled": {
          opacity: 0.3,
          color: "inherit",
        },
      },
    },
    variants: [
      {
        props: { size: "small" },
        style: {
          padding: "2px",
        },
      },
      {
        props: { size: "medium" },
        style: {
          padding: "5px",
        },
      },
      {
        props: { size: "large" },
        style: {
          padding: "8px",
        },
      },
      {
        props: { color: "secondary" },
        style: {
          backgroundColor: color.PRIMARY,
          color: "#19171d",
          "&:hover": {
            backgroundColor: color.PRIMARY,
            color: "#19171d",
          },
        },
      },
      {
        props: { color: "info" },
        style: {
          backgroundColor: color.HIGHLIGHT,
          color: color.LIGHT,
          "&:hover": {
            backgroundColor: color.HIGHLIGHT_HOVER,
            color: color.LIGHT,
          },
          "&.Mui-disabled": {
            backgroundColor: rgba(color.HIGHLIGHT, 0.5),
            color: color.LIGHT,
          },
        },
      },
      {
        props: { className: "bg-gray" },
        style: {
          "&:hover": {
            backgroundColor: rgba(color.PRIMARY_BACKGROUND, 0.8),
          },
        },
      },
    ],
  },
};

export default components.MuiIconButton;
