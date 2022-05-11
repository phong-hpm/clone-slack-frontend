import { Theme } from "@mui/material";

// utils
import { color, rgba } from "utils/constants";

const components: Theme["components"] = {
  MuiIconButton: {
    styleOverrides: {
      root: {
        fontSize: "inherit",
        color: "inherit",
        padding: "7px",
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
          padding: "4px",
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
    ],
  },
};

export default components.MuiIconButton;
