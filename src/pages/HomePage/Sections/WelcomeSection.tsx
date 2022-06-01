// components
import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";

// utils
import { color } from "utils/constants";

// constants
import homepageConstants from "pages/HomePage/_homepage.constants";

const WelcomeSection = () => {
  const theme = useTheme();
  const isUpMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box display="flex" flexDirection="column" py={5}>
      <Box>
        <Typography
          fontFamily="Larsseit, sans-serif"
          fontSize={{ xs: 36, md: 50 }}
          lineHeight={1}
          textAlign="center"
          color={color.LIGHT}
        >
          {homepageConstants.welcomeSection.title}
        </Typography>
      </Box>

      <Box display={{ xs: "block", md: "flex" }} justifyContent="center" mt={3}>
        <Button
          className="light-contained"
          variant="outlined"
          fullWidth={!isUpMd}
          sx={{ mt: 2, mx: 1, px: 5, py: 2.5 }}
        >
          TRY FOR FREE
        </Button>
        <Button
          className="light-outlined"
          variant="outlined"
          fullWidth={!isUpMd}
          sx={{ mt: 2, mx: 1, px: 5, py: 2.5 }}
        >
          TALK TO SALE
        </Button>
      </Box>
    </Box>
  );
};

export default WelcomeSection;
