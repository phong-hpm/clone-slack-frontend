import { Theme } from "@mui/material";

// utils
import { color } from "utils/constants";

const components: Theme["components"] = {
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 54,
        height: 30,
        padding: 0,

        ".MuiSwitch-switchBase": {
          padding: 0,
          margin: 5,
          transitionDuration: "200ms",

          "&.Mui-checked": {
            transform: "translateX(25px)",
            color: color.LIGHT,
          },

          ".MuiSwitch-thumb": {
            boxSizing: "border-box",
            width: 20,
            height: 20,
            backgroundColor: color.HIGH,
          },

          "&.Mui-checked .MuiSwitch-thumb": {
            backgroundColor: color.LIGHT,
          },

          "+ .MuiSwitch-track": {
            height: 28,
            width: "100%",
            borderRadius: 15,
            backgroundColor: "transparent",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: color.BORDER_ITEM,
            opacity: 1,
          },

          "&.Mui-checked + .MuiSwitch-track": {
            opacity: 1,
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: color.SUCCESS,
            backgroundColor: color.SUCCESS,
          },
        },
      },
    },
  },
};

export default components.MuiSwitch;
