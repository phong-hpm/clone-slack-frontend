import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiSvgIcon: {
    styleOverrides: {
      root: {
        fontSize: "inherit",
        color: "inherit",
      },
    },
    variants: [
      {
        props: { fontSize: "medium" },
        style: {
          fontSize: "18px",
        },
      },
    ],
  },
};

export default components.MuiSvgIcon;
