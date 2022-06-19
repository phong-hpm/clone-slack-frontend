import { Theme } from "@mui/material";

// utils
import { color } from "utils/constants";

const components: Theme["components"] = {
  MuiSlider: {
    styleOverrides: {
      root: {
        height: 6,

        "& .MuiSlider-track": {
          color: color.HIGHLIGHT,
          borderWidth: 0,
        },

        "& .MuiSlider-thumb": {
          width: 14,
          height: 14,
        },
      },
    },
    variants: [
      {
        props: { size: "small" },
        style: {
          height: 4,
          "& .MuiSlider-thumb::after": { height: 30 },
        },
      },
      {
        props: { className: "hide-thumb" },
        style: {
          ".MuiSlider-thumb": {
            display: "none",
          },
        },
      },
    ],
  },
};

export default components.MuiSlider;
