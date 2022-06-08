import ReactDOMServer from "react-dom/server";
import { useNavigate } from "react-router-dom";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

// components
import { Box, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import SvgFileIcon from "components/SvgFileIcon";

// utils
import { color, rgba } from "utils/constants";
import mapMarketingSources from "utils/mapMarketingSources";

// constants
import homepageConstants from "pages/HomePage/_homepage.constants";

/* istanbul ignore next */
const PeachSection = () => {
  const navigate = useNavigate();

  const theme = useTheme();
  const isUpSM = useMediaQuery(theme.breakpoints.up("sm"));

  const data = homepageConstants.peachSection(navigate);

  const renderPromotion = (promotion: {
    subTitle: string;
    title: string;
    action: string;
    img: string;
  }) => {
    return (
      <Box
        key={promotion.title}
        display="flex"
        flexDirection="column"
        p={1.5}
        bgcolor={color.LIGHT}
        sx={{
          maxWidth: { xs: 260, sm: "none" },
          cursor: "pointer",
          transform: "scale(1)",
          boxShadow: `${rgba(color.DARK, 0.1)} 0px 0px 12px 0px`,
          transition: "transform 0.3s ease-in-out",
          ":hover": {
            transform: "scale(1.05)",
            boxShadow: `${rgba(color.DARK, 0.2)} 0px 0px 12px 0px`,
            transition: "transform 0.3s ease-in-out",
          },
        }}
      >
        <Box display="flex">
          <img
            {...mapMarketingSources(promotion.img)}
            alt=""
            style={{ minWidth: isUpSM ? "auto" : 260, minHeight: isUpSM ? "auto" : 180 }}
          />
        </Box>
        <Box mt={2}>
          <Typography fontSize={14} color="rgb(69, 66, 69)">
            {promotion.subTitle}
          </Typography>
        </Box>
        <Box flexBasis={150} mt={0.5}>
          <Typography fontSize={24} fontWeight={700} lineHeight="30px" color={color.DARK}>
            {promotion.title}
          </Typography>
        </Box>
        <Box>
          <Link
            display="flex"
            justifyContent="space-between"
            underline="none"
            color={color.SELECTED_ITEM}
          >
            <Typography fontSize={14} fontWeight={700}>
              {promotion.action}
            </Typography>
            <Typography fontSize={14} fontWeight={700}>
              <SvgFileIcon icon="arrow-right-long-thick" width={20} height={12} />
            </Typography>
          </Link>
        </Box>
      </Box>
    );
  };

  return (
    <Box display="flex" flexDirection="column" py={5}>
      <Box>
        <Typography
          fontFamily="Larsseit, sans-serif"
          fontSize={{ xs: 36, md: 50 }}
          lineHeight={1}
          textAlign="center"
        >
          {data.title}
        </Typography>
      </Box>

      <Box
        display="grid"
        justifyContent="space-between"
        gridTemplateColumns={{ xs: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
      >
        {data.steps.map((step, index) => {
          return (
            <Box key={step.title} px={3} py={3}>
              <Box display="flex" py={{ xs: 1, md: 1.5 }}>
                <Box
                  width={40}
                  height={40}
                  color={color.LIGHT}
                  bgcolor="rgb(74, 21, 75)"
                  borderRadius={1}
                >
                  <Typography fontSize={24} fontWeight={700} lineHeight="40px" textAlign="center">
                    {index + 1}
                  </Typography>
                </Box>
              </Box>
              <Box py={{ xs: 1, md: 1.5 }}>
                <Typography variant="h4">{step.title}</Typography>
              </Box>
              <Box py={{ xs: 1, md: 1.5 }}>
                <Typography fontSize={18}>{step.detail}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box
        display={{ xs: "none", sm: "grid" }}
        justifyContent="space-between"
        gridTemplateColumns={{ xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        mt={{ xs: 2, md: 5 }}
        sx={{ gridGap: "3%" }}
      >
        {data.promotions.map(renderPromotion)}
      </Box>

      <Box width="100%">
        <Swiper
          modules={[Pagination]}
          hidden={isUpSM}
          spaceBetween={500}
          slidesPerView={1}
          pagination={{
            type: "bullets",
            clickable: true,
            el: "#swiper-dots-wrapper",
            renderBullet: (index, className) => {
              return ReactDOMServer.renderToString(
                <Box
                  className={className}
                  display="inline-block"
                  width={13}
                  height={13}
                  borderRadius={8}
                  bgcolor="rgb(97, 31, 105)"
                  style={{ margin: 8, borderRadius: 8 }}
                />
              );
            },
          }}
        >
          {data.promotions.map((promotion) => (
            <SwiperSlide
              key={promotion.title}
              style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}
            >
              {renderPromotion(promotion)}
            </SwiperSlide>
          ))}
        </Swiper>
        <Box
          id="swiper-dots-wrapper"
          display={{ xs: "flex", sm: "none" }}
          justifyContent="center"
        />
      </Box>
    </Box>
  );
};

export default PeachSection;
