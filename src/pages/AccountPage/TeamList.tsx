import { FC, Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

// redux store
import { useSelector } from "store";

// redux selectors
import userSelectors from "store/selectors/user.selector";
import teamsSelectors from "store/selectors/teams.selector";

// components
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Link,
  List,
  ListItemButton,
  Typography,
  Zoom,
} from "@mui/material";
import SvgFileIcon from "components/SvgFileIcon";
import SlackIcon from "components/SlackIcon";

// utils
import { color, rgba, routePaths } from "utils/constants";

// types
import { TeamType } from "store/slices/_types";

const TeamPage: FC = () => {
  const navigate = useNavigate();

  const user = useSelector(userSelectors.getUser);
  const isTeamsLoading = useSelector(teamsSelectors.isLoading);
  const teamList = useSelector(teamsSelectors.getTeamList);

  const [hoverId, setHoverId] = useState("");

  const renderTeam = (team: TeamType) => {
    const sortName = team.name
      .split(" ")
      .map((word) => word[0])
      .join("");

    return (
      <ListItemButton
        sx={{ display: "flex", px: 3, ":hover": { background: "rgb(248, 248, 248)" } }}
        onClick={() => navigate(`${routePaths.CHATBOX_PAGE}/${team.id}`)}
        onMouseOver={() => setHoverId(team.id)}
        onMouseLeave={() => setHoverId("")}
      >
        <Box key={team.id} flexGrow={1} display="flex" py={2}>
          <Box width={44} borderRadius={1} bgcolor={color.GRAY_SCALE} color={color.LIGHT}>
            <Typography fontSize={24} lineHeight="44px" fontWeight={700} textAlign="center">
              {sortName}
            </Typography>
          </Box>
          <Box ml={1.5}>
            <Typography variant="h4">{team.name}</Typography>
            <Typography variant="h5" color={rgba(color.MAX_DARK, 0.7)}>
              {team.users.length} members
            </Typography>
          </Box>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          color={hoverId === team.id ? color.SELECTED_ITEM : ""}
        >
          <Zoom in={hoverId === team.id}>
            <Typography variant="h4" fontWeight={400}>
              Open
            </Typography>
          </Zoom>
          <SlackIcon icon="arrow-right-medium" style={{ fontSize: 32, marginRight: 24 }} />
        </Box>
      </ListItemButton>
    );
  };

  if (isTeamsLoading)
    return (
      <Box display="flex" justifyContent="center" mt={5} width="100%">
        <CircularProgress />
      </Box>
    );

  return (
    <Box flexGrow={1} display="flex" flexDirection="column" mt={5}>
      {/* team list items */}
      <Box
        borderRadius={1}
        border={`1px solid ${color.BORDER_GRAY}`}
        boxShadow={`${rgba(color.DARK, 0.1)} 0 4px 12px`}
      >
        <Box px={3} py={2.25}>
          Workspaces for <strong>{user.email}</strong>
        </Box>
        <Divider sx={{ borderColor: color.BORDER_GRAY }} />

        <List component="div" disablePadding>
          {teamList.map((team, index) => {
            return (
              <Fragment key={team.id}>
                {index !== 0 && <Divider sx={{ ml: 3, borderColor: color.BORDER_GRAY }} />}
                {renderTeam(team)}
              </Fragment>
            );
          })}
        </List>
      </Box>

      {/* navigate login */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={3}
        py={2.5}
        mt={5}
        borderRadius={3}
        color={color.MAX_DARK}
        bgcolor="rgba(244, 237, 228, 0.5)"
      >
        <Box display="flex" alignItems="center">
          <SvgFileIcon icon="start-workspace" height={42} />
          <Typography color={color.GRAY_SCALE} ml={1}>
            Want to use Slack with a different team?
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: color.LIGHT,
            border: `1px solid ${rgba(color.MAX_DARK, 0.3)}`,
          }}
        >
          Create Another Workspace
        </Button>
      </Box>

      {/* navigate login */}
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography color={color.GRAY_SCALE} textAlign="center" mb={0.5}>
          Not seeing your workspace?
        </Typography>

        <Link underline="hover" onClick={() => navigate(routePaths.SIGNIN_PAGE)}>
          Try a different email
        </Link>
      </Box>
    </Box>
  );
};

export default TeamPage;
