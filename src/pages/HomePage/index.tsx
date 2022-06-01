import { FC } from "react";

// components
import { Box, Container, IconButton } from "@mui/material";
import PageHeader from "features/PageHeader";
import PageFooter from "features/PageFooter";
import HeroSection from "./Sections/HeroSection";
import BranchesSection from "./Sections/BranchesSection";
import BetterTomorrowSection from "./Sections/BetterTomorrowSection";
import FeatureSection from "./Sections/FeatureSection";
import PeachSection from "./Sections/PeachSection";
import WelcomeSection from "./Sections/WelcomeSection";

// utils
import { color } from "utils/constants";

// images
import SlackIcon from "components/SlackIcon";

// hooks
import useYoutubeVideo from "hooks/useYoutubeVideo";

// constants
import homepageConstants from "pages/HomePage/_homepage.constants";

const HomePage: FC = () => {
  const { isPlaying, play, destroy } = useYoutubeVideo("youtube-player");

  return (
    <Box color={color.MAX_DARK} fontFamily="Circular-Pro, sans-serif">
      <PageHeader />

      <Box bgcolor="rgb(246, 239, 232)" py={5}>
        <Container>
          <Box pt={{ xs: 10, md: 15 }} pb={5}>
            <HeroSection />
          </Box>

          <Box py={5}>
            <BranchesSection />
          </Box>

          <Box py={5}>
            <BetterTomorrowSection onPlay={play} />
          </Box>
        </Container>
      </Box>

      <Box py={5}>
        <Container>
          {homepageConstants.featureSections.map((feature) => (
            <Box key={feature.title} py={5}>
              <FeatureSection {...feature} onPlay={play} />
            </Box>
          ))}
        </Container>
      </Box>

      <Box bgcolor="rgb(246, 239, 232)" pb={5}>
        <Container>
          <Box py={5}>
            <PeachSection />
          </Box>
        </Container>
      </Box>

      <Box
        bgcolor="rgb(74, 21, 75)"
        pb={5}
        sx={{
          clipPath: {
            xs: "ellipse(105% 100% at center top)",
            md: "ellipse(75% 100% at center top)",
          },
        }}
      >
        <Container>
          <Box py={5}>
            <WelcomeSection />
          </Box>
        </Container>
      </Box>

      {/* youtube player */}
      <Box id="youtube-player" position="fixed" zIndex={1500} top={0} left={0} />

      {/* youtube close button */}
      {isPlaying && (
        <Box position="fixed" zIndex={1500} top={70} right={20}>
          <IconButton sx={{ p: 2, color: color.LIGHT, bgcolor: color.MAX_DARK }} onClick={destroy}>
            <SlackIcon icon="close" />
          </IconButton>
        </Box>
      )}
      <Container>
        <PageFooter />
      </Container>
    </Box>
  );
};

export default HomePage;
