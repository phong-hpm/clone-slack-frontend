import { FC } from "react";

// components
import { Box, Link, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import SvgFileIcon from "components/SvgFileIcon";

// utils
import { color } from "utils/constants";
import mapMarketingSources from "utils/mapMarketingSources";

export interface FeatureSectionProps {
  isReverse?: boolean;
  title: string;
  desc: string;
  linkText: string;
  videoFile: string;
  videoList: { youtubeId: string; label: string; thumb: string; time: string }[];
  onPlay: (id: string) => void;
}

const FeatureSection: FC<FeatureSectionProps> = ({
  isReverse,
  title,
  desc,
  linkText,
  videoFile,
  videoList,
  onPlay,
}) => {
  const renderVideo = () => {
    return (
      <Box flex="1" display={{ xs: "none", md: "block" }}>
        <video autoPlay loop muted {...mapMarketingSources(videoFile)} style={{ maxHeight: 450 }} />
      </Box>
    );
  };

  return (
    <Box
      display="grid"
      justifyContent="space-between"
      gridTemplateColumns={{ md: isReverse ? "50% 40%" : "40% 50%" }}
      flexDirection={{ xs: "column", md: "row" }}
    >
      {isReverse && renderVideo()}

      <Box flex="1" display="flex" flexDirection="column">
        <Typography fontFamily="Larsseit, sans-serif" fontSize={{ xs: 24, md: 32 }} lineHeight={1}>
          {title}
        </Typography>
        <Typography fontSize={{ xs: 16, md: 18, lg: 20 }} lineHeight={1.3} fontWeight={400} mt={2}>
          {desc}
        </Typography>
        <Box mt={2}>
          <Link component="span" underline="hover" color={color.SELECTED_ITEM}>
            <Typography fontSize={{ xs: 15, md: 18 }} component="span">
              {linkText} <SvgFileIcon icon="arrow-right-long" width={20} height={12} />
            </Typography>
          </Link>
        </Box>

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          mt={3}
        >
          {videoList.map((item, index) => {
            return (
              <Box
                key={item.youtubeId}
                flexBasis={{ xs: "100%", sm: "45%" }}
                mt={{ xs: index === 1 ? 2 : 0, sm: 0 }}
                onClick={() => onPlay(item.youtubeId)}
              >
                <Box position="relative">
                  <img
                    loading="lazy"
                    {...mapMarketingSources(item.thumb)}
                    alt=""
                    style={{ borderRadius: 6 }}
                  />
                  <Box position="absolute" top={0} bottom={0} left={0} right={0} p={1}>
                    <Box
                      display="flex"
                      justifyContent="end"
                      alignItems="end"
                      height="100%"
                      sx={{
                        cursor: "pointer",
                        ":hover": { div: { bgcolor: color.SELECTED_ITEM } },
                      }}
                    >
                      <Box px={3} py={1.5} borderRadius={1} bgcolor="rgb(54, 197, 240)">
                        <SlackIcon color={color.LIGHT} icon="play-filled" />
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" mt={1.5}>
                  <Typography fontSize={14} fontWeight={700}>
                    {item.label}
                  </Typography>
                  <Typography fontSize={14}>{item.time}</Typography>
                </Box>
              </Box>
            );
          })}

          {videoList.length === 1 && <Box />}
        </Box>
      </Box>

      {!isReverse && renderVideo()}
    </Box>
  );
};

export default FeatureSection;
