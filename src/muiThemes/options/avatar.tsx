import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiAvatar: {
    defaultProps: {
      variant: "square",
      sx: {
        height: "26px",
        width: "26px",
      },
    },
    styleOverrides: {
      root: {},
    },
    variants: [
      {
        props: { variant: "square" },
        style: {
          borderRadius: "4px",
        },
      },
    ],
  },
};

export default components.MuiAvatar;
