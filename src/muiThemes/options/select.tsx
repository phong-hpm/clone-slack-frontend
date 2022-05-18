import { Box, Theme } from "@mui/material";
import SlackIcon from "components/SlackIcon";

const components: Theme["components"] = {
  MuiSelect: {
    defaultProps: {
      IconComponent: () => (
        <Box className="MuiSelect-arrow">
          <SlackIcon icon="chevron-down" cursor="pointer" />
        </Box>
      ),
    },
    styleOverrides: {},
    variants: [
      {
        props: { variant: "standard" },
        style: {
          color: "inherit",
          fontWeight: 700,
          lineHeight: "20px",
          position: "relative",

          "&::before, &::after": {
            display: "none",
          },

          "&.MuiInput-root.MuiInputBase-root .MuiSelect-select": {
            padding: "5px 24px 5px 10px",
            backgroundColor: "transparent",
            minHeight: "auto",
            zIndex: 1,

            "&::focus": {
              backgroundColor: "transparent",
            },
          },

          "& .MuiSelect-nativeInput": {
            height: 0,
            borderWidth: 0,
            padding: 0,
          },

          "& .MuiSelect-arrow": {
            zIndex: 0,
            position: "absolute",
            right: 3,
            top: "50%",
            transform: "translateY(-45%)",
          },
        },
      },
      {
        props: { size: "small" },
        style: {
          fontSize: 13,

          "&.MuiInput-root.MuiInputBase-root .MuiSelect-select": {
            padding: "0 4px",
            lineHeight: "20px",
            height: "20px",
          },
        },
      },
    ],
  },
};

export default components.MuiSelect;
