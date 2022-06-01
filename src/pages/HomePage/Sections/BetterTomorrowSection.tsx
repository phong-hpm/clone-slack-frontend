import { FC } from "react";

// components
import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import { color } from "utils/constants";
import mapMarketingSources from "utils/mapMarketingSources";

// constants
import homepageConstants from "pages/HomePage/_homepage.constants";

export interface BetterTomorrowSectionProps {
  onPlay: (id: string) => void;
}

const BetterTomorrowSection: FC<BetterTomorrowSectionProps> = ({ onPlay }) => {
  const theme = useTheme();
  const isUpMD = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      display="grid"
      justifyContent={{ xs: "center", md: "space-between" }}
      alignItems="center"
      gridTemplateColumns={{ md: "43% 50%" }}
      flexDirection={{ xs: "column", md: "row" }}
    >
      {/* video thumbnail */}
      <Box position="relative">
        <img loading="lazy" {...mapMarketingSources("video-thumbnail.jpeg")} alt="" />

        <Box position="absolute" top={0} bottom={0} left={0} right={0}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            sx={{ cursor: "pointer", ":hover": { div: { bgcolor: color.SELECTED_ITEM } } }}
            onClick={() => onPlay("ZDs056YM4fc")}
          >
            <Box px={4} py={2.5} borderRadius={1} bgcolor="rgb(54, 197, 240)">
              <SlackIcon color={color.LIGHT} icon="play-filled" />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* video content */}
      <Box mt={{ xs: 5, md: 0 }}>
        <Typography fontFamily="Larsseit, sans-serif" fontSize={{ xs: 32, md: 32 }} lineHeight={1}>
          {homepageConstants.betterTomorrowSection.title}
        </Typography>
        <Typography fontSize={20} lineHeight={1.3} fontWeight={400} mt={2}>
          {homepageConstants.betterTomorrowSection.desc}
        </Typography>
        <Button
          className="purple-outlined"
          variant="outlined"
          fullWidth={!isUpMD}
          sx={{ mt: 2, px: 4, py: 2.5 }}
          onClick={() => onPlay("ZDs056YM4fc")}
        >
          WATCH VIDEO
        </Button>
      </Box>
    </Box>
  );
};

export default BetterTomorrowSection;
