import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiPopper: {
    styleOverrides: {
      root: {
        ".MuiPaper-root": {
          boxShadow: "0 0 0 1px rgba(232, 232,232, 0.13), 0 5px 10px rgba(0,0,0,.12)",
        },

        ".MuiAutocomplete-listbox": {
          backgroundImage: "none",
          backgroundColor: "rgba(34, 37, 41, 1)",

          ".MuiAutocomplete-option": {
            color: "rgba(232, 232, 232, 0.7)",
            padding: "4px 16px",

            "&.Mui-focused": {
              backgroundColor: "#1264a3",
            },

            ".label": {
              color: "rgb(209, 210, 211)",
            },

            ".desc": {
              color: "gba(232, 232, 232, 0.7)",
            },
          },
        },
      },
    },
  } as any,
};

export default components.MuiPopper;
