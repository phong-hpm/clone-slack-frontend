import { Theme } from "@mui/material";

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
            color: "#fff",
          },

          ".MuiSwitch-thumb": {
            boxSizing: "border-box",
            width: 20,
            height: 20,
            backgroundColor: "rgb(171,172,173)",
          },

          "&.Mui-checked .MuiSwitch-thumb": {
            backgroundColor: "rgb(255, 255, 255, 255)",
          },

          "+ .MuiSwitch-track": {
            height: 28,
            width: "100%",
            borderRadius: 15,
            backgroundColor: "transparent",
            border: "1px solid rgba(232, 232, 232, 0.5)",
            opacity: 1,
          },

          "&.Mui-checked + .MuiSwitch-track": {
            opacity: 1,
            border: "1px solid rgb(0,122,90)",
            backgroundColor: "rgb(0,122,90)",
          },
        },
      },
    },
  },
};

export default components.MuiSwitch;
