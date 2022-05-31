import { Theme } from "@mui/material";

// utils
import { color, rgba } from "utils/constants";

const components: Theme["components"] = {
  MuiChip: {
    styleOverrides: {
      root: {},
    },
    variants: [
      {
        props: { color: "default" },
        style: {
          backgroundColor: rgba(color.MAX, 0.04),
          "&:hover": {
            backgroundColor: color.PRIMARY_BACKGROUND,
          },
          color: color.PRIMARY,
        },
      },
      {
        props: { color: "primary" },
        style: {
          backgroundColor: color.SELECTED_ITEM,
          color: color.PRIMARY,
        },
      },
      {
        props: { color: "secondary" },
        style: {
          backgroundColor: "rgba(29, 155, 209, 0.1)",
          color: color.PRIMARY,
        },
      },
      {
        props: { color: "error" },
        style: {
          backgroundColor: color.DANGER,
          color: color.PRIMARY,
        },
      },
    ],
  },
};

export default components.MuiChip;
