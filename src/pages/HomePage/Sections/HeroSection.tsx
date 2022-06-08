import { useNavigate } from "react-router-dom";

// components
import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";

// utils
import { routePaths } from "utils/constants";
import mapMarketingSources from "utils/mapMarketingSources";

// data
import homepageConstants from "../_homepage.constants";

const HeroSection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isUpMD = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      display="grid"
      justifyContent="space-between"
      gridTemplateColumns={{ md: "43% 50%" }}
      flexDirection={{ xs: "column", md: "row" }}
    >
      <Box flex="1" display="flex" flexDirection="column">
        <Typography
          fontFamily="Larsseit, sans-serif"
          fontSize={{ xs: 48, md: 42, lg: 64 }}
          lineHeight={1}
        >
          {homepageConstants.heroSection.title}
        </Typography>
        <Typography fontSize={20} lineHeight={1.3} fontWeight={400} mt={2}>
          {homepageConstants.heroSection.desc}
        </Typography>
        <Box mt={4}>
          <Button
            className="purple-contained"
            fullWidth={!isUpMD}
            sx={{ px: 4, py: 2.5 }}
            onClick={() => navigate(routePaths.SIGNUP_PAGE)}
          >
            TRY FOR FREE
          </Button>
        </Box>
      </Box>

      <Box flex="1" mt={{ xs: 4, md: -4 }}>
        <img loading="lazy" {...mapMarketingSources("hero.jpeg")} alt="" />
      </Box>
    </Box>
  );
};

export default HeroSection;
