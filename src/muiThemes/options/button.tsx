import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiButton: {
    styleOverrides: {
      root: {
        fontSize: "inherit",
        fontWeight: 800,
        textTransform: "capitalize",
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
    ],
  },
};

export default components.MuiButton;
