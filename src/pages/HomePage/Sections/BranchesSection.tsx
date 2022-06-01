// components
import { Box } from "@mui/material";

// utils
import mapMarketingSources from "utils/mapMarketingSources";

// constants
import homepageConstants from "pages/HomePage/_homepage.constants";

const BranchesSection = () => {
  return (
    <Box
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      flexWrap={{ xs: "wrap", md: "nowrap" }}
    >
      {homepageConstants.branchesSection.branchList.map((branch) => {
        return (
          <Box key={branch} sx={{ maxWidth: 170 }} m={1.5}>
            <img loading="lazy" {...mapMarketingSources(`${branch}.png`)} alt={branch} />
          </Box>
        );
      })}
    </Box>
  );
};

export default BranchesSection;
