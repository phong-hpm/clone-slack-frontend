import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiTextField: {
    styleOverrides: {
      root: {
        ".MuiInputBase-root": {
          ".MuiOutlinedInput-input": {
            padding: "10px 16px",

            "&::placeholder": {
              opacity: 0.6,
            },
          },

          ".MuiOutlinedInput-notchedOutline": {
            borderColor: "#818385",
          },

          "&:hover": {
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#818385",
            },
          },
        },
      },
    },
  },
};

export default components.MuiTextField;
