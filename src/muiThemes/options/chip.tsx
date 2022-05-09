import { Theme } from "@mui/material";

// utils
import { color, rgba } from "utils/constants";

const components: Theme["components"] = {
  MuiChip: {
    styleOverrides: {
      root: {
        backgroundColor: rgba(color.MAX, 0.04),
      },
    },
    variants: [
      {
        props: { color: "primary" },
        style: {
          backgroundColor: color.SELECTED_ITEM,
          color: color.PRIMARY,
        },
      },
    ],
  },
};

export default components.MuiChip;
