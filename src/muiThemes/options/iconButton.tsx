import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiIconButton: {
    styleOverrides: {
      root: {
        fontSize: "inherit",
        color: "inherit",
        // borderRadius: "4px",
        padding: "7px",
      },
    },
    variants: [
      {
        props: { size: "small" },
        style: {
          padding: "0px",
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
