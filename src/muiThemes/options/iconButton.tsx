import { Theme } from "@mui/material";

// utils
import { color } from "../../utils/constants";

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
    ],
  },
};

export default components.MuiIconButton;
