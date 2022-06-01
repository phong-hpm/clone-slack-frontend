import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";

// components
import { Box, Collapse, Divider, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import SvgFileIcon from "components/SvgFileIcon";
import SlackIcon from "components/SlackIcon";

// utils
import featuresConstants from "./_features.constants";
import { color, routePaths } from "utils/constants";
import { getPlatform } from "utils/detectplatform";

const PageFooter = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isUpMd = useMediaQuery(theme.breakpoints.up("md"));

  const [collapseId, setCollapseId] = useState("");

  const handleToggleCollapse = (id: string) => {
    if (id === collapseId) setCollapseId("");
    else setCollapseId(id);
  };

  const renderNavigations = (navigationList: { label: string; path: string }[]) => {
    return navigationList.map((navigation) => {
      return (
        <Link
          key={navigation.label}
          component="div"
          underline="none"
          color="rgb(69, 66, 69)"
          py={1.5}
          sx={{ ":hover": { color: color.SELECTED_ITEM } }}
          onClick={() => navigate(navigation.path)}
        >
          <Typography fontSize={14}>{navigation.label}</Typography>
        </Link>
      );
    });
  };

  return (
    <Box>
      {/* navigations */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        py={{ xs: 2, md: 4 }}
      >
        <Box mt={5}>
          <SvgFileIcon icon="slack-main" />
        </Box>
        <Box
          flexBasis="80%"
          display={{ xs: "flex", md: "grid" }}
          flexDirection="column"
          gridTemplateColumns="repeat(5, 1fr)"
          mt={5}
        >
          {featuresConstants.pageFooter.navigationGroups.map(({ title, navigations }) => {
            if (isUpMd) {
              return (
                <Box key={title}>
                  <Typography py={1} fontSize={14} fontWeight={700}>
                    {title}
                  </Typography>
                  <Box>{renderNavigations(navigations)}</Box>
                </Box>
              );
            }

            return (
              <Box key={title}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  py={1}
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleToggleCollapse(title)}
                >
                  <Typography fontSize={14} fontWeight={700}>
                    {title}
                  </Typography>
                  <Box
                    display="inline-block"
                    className={classnames("rotate-270-360", collapseId === title && "rotate")}
                  >
                    <SvgFileIcon icon="chevron-down" />
                  </Box>
                </Box>
                <Collapse in={collapseId === title} timeout={0}>
                  <Box display="flex" flexDirection="column">
                    {renderNavigations(navigations)}
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgb(235, 234, 235)", borderWidth: 1 }} />

      {/* signature */}
      <Box py={2}>
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
          {/* navigations */}
          <Box flexGrow={1} display="flex" flexDirection={{ xs: "column", md: "row" }}>
            {featuresConstants.pageFooter.signatures.navigations.map(({ label, path }) => {
              return (
                <Link
                  key={label}
                  underline="none"
                  color={color.DARK}
                  pr={2}
                  py={2}
                  sx={{ ":hover": { color: color.SELECTED_ITEM } }}
                  onClick={() => navigate(path)}
                >
                  <Typography fontSize={14} fontWeight={700}>
                    {label}
                  </Typography>
                </Link>
              );
            })}
          </Box>

          <Box mr={2}>
            <Link
              component="div"
              underline="none"
              color={color.SELECTED_ITEM}
              py={2}
              onClick={() => navigate(`${routePaths.DOWNLOAD_PAGE}/${getPlatform()}`)}
            >
              <SlackIcon icon="cloud-download" />
              <Typography component="span" ml={1} fontSize={14} fontWeight={700}>
                Download Slack
              </Typography>
            </Link>
          </Box>

          {/* socials */}
          <Box display="flex" justifyContent="space-between">
            {featuresConstants.pageFooter.signatures.metaSocials.map(({ icon, path }) => {
              return (
                <Box key={path} display="inline-block" pl={{ xs: 0, md: 2 }} py={2}>
                  <SvgFileIcon icon={icon} />
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box py={2}>
          <Typography variant="h6" color="rgb(69, 66, 69)">
            ©2022 Slack Technologies, LLC, a Salesforce company. All rights reserved. Various
            trademarks held by their respective owners.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PageFooter;
