import { Theme } from "@mui/material";

// utils
import { color } from "utils/constants";

const components: Theme["components"] = {
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontSize: "inherit",
        color: "inherit",
        transitionDuration: "0ms",
        padding: "4px 24px",
        whiteSpace: "normal",

        "&:hover, &.Mui-selected, &.Mui-selected:hover": {
          backgroundColor: color.HOVER_ITEM,
        },
      },
    },
    variants: [
      {
        props: { className: "light" },
        style: {
          color: color.MAX_DARK,
          "&:hover, &.Mui-selected, &.Mui-selected:hover": {
            color: color.LIGHT,
          },
        },
      },
    ],
  },
};

export default components.MuiMenuItem;
