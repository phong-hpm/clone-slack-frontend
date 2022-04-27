import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiAutocomplete: {
    styleOverrides: {
      root: {
        ".MuiInputBase-root": {
          padding: "4px 10px",

          ".MuiAutocomplete-input": {
            // padding: "0 4px",
          },
        },
      },
    },
  },
};

export default components.MuiAutocomplete;
