import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiIconButton: {
    styleOverrides: {
      root: {
        fontSize: "inherit",
        color: "inherit",
        padding: "7px",
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
          backgroundColor: "#d1d2d3",
          color: "#19171d",
          "&:hover": {
            backgroundColor: "#d1d2d3",
            color: "#19171d",
          },
        },
      },
    ],
  },
};

export default components.MuiIconButton;
