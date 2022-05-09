import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiAvatar: {
    defaultProps: {
      variant: "square",
    },
    styleOverrides: {
      root: {
        height: "36px",
        width: "36px",
      },
    },
    variants: [
      {
        props: { variant: "square" },
        style: {
          borderRadius: "4px",
        },
      },
      {
        props: { sizes: "small" },
        style: {
          height: "20px",
          width: "20px",
        },
      },
      {
        props: { sizes: "medium" },
        style: {
          height: "26px",
          width: "26px",
        },
      },
      {
        props: { sizes: "300" },
        style: {
          height: "300px",
          width: "300px",
        },
      },
    ],
  },
};

export default components.MuiAvatar;
