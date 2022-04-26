import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiButton: {
    styleOverrides: {
      root: {
        fontSize: "inherit",
        fontWeight: 900,
        textTransform: "initial",
      },
    },
    variants: [
      {
        props: { variant: "contained", color: "primary" },
        style: {
          backgroundColor: "#007a5a",
          color: "#ffffff",

          "&:hover": {
            backgroundColor: "#148567",
          },

          "&:disabled": {
            backgroundColor: "#35373b",
            color: "rgba(209, 210, 211, 0.75)",
          },
        },
      },
      {
        props: { variant: "outlined", color: "primary" },
        style: {
          color: "#d1d2d3",
          backgroundColor: "transparent",
          borderColor: "transparent",

          "&:hover": {
            backgroundColor: "rgba(232, 232, 232, 0.04)",
            borderColor: "transparent",
          },

          // "&:disabled": {
          //   backgroundColor: "#35373b",
          //   color: "rgba(209, 210, 211, 0.75)",
          // },
        },
      },
    ],
  },
};

export default components.MuiButton;
