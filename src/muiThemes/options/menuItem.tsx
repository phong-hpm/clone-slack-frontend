import { Theme } from "@mui/material";

// utils
import { color } from "../../utils/constants";

const components: Theme["components"] = {
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontSize: "inherit",
        color: "inherit",
        transitionDuration: "0ms",
        padding: "4px 24px",

        "&:hover, &.Mui-selected, &.Mui-selected:hover": {
          backgroundColor: color.HOVER_ITEM,
        },
      },
    },
  },
};

export default components.MuiMenuItem;
