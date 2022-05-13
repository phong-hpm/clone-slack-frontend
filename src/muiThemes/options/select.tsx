import { Theme } from "@mui/material";

const components: Theme["components"] = {
  MuiSelect: {
    styleOverrides: {},
    variants: [
      {
        props: { variant: "standard" },
        style: {
          "&::before, &::after": {
            display: "none",
          },

          "& .MuiSelect-select": {
            backgroundColor: "transparent",

            "&::focus": {
              backgroundColor: "transparent",
            },
          },

          "& .MuiSelect-nativeInput": {
            height: 0,
            borderWidth: 0,
            padding: 0,
          },

          "& .MuiSelect-iconStandard": {
            display: "none",
          },
        },
      },
      {
        props: { size: "small" },
        style: {
          fontSize: 13,

          "&.MuiInput-root.MuiInputBase-root .MuiSelect-select": {
            padding: "0 5px",
            lineHeight: "20px",
            height: "20px",
          },
        },
      },
    ],
  },
};

export default components.MuiSelect;
