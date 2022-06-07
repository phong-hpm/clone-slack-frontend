// redux store
import { useSelector } from "store";

// redux selector
import channelsSelectors from "store/selectors/channels.selector";

// components
import { Box, Typography, Button } from "@mui/material";
import ProTag from "features/ProTag";

// types
import FieldGroup from "components/FieldGroup";

const IntergrationTab = () => {
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  if (!selectedChannel) return <></>;

  return (
    <Box>
      <FieldGroup>
        <Box display="flex" alignItems="center">
          <Typography component="span" fontWeight={700}>
            Workflows
          </Typography>
          <ProTag ml={1} />
        </Box>
        <Typography mt={0.5}>
          Automate the tasks and processes unique to your team, no coding required.
        </Typography>

        <Button size="small" variant="outlined" sx={{ mt: 1.5, px: 1.5 }}>
          <Typography variant="h5" fontWeight={700}>
            See Upgrade Options
          </Typography>
        </Button>
      </FieldGroup>

      <FieldGroup imageSrc="apps-empty.png">
        <Box display="flex" alignItems="center">
          <Typography component="span" fontWeight={700}>
            Apps
          </Typography>
        </Box>
        <Typography mt={0.5}>
          Bring the tools you need into this channel to pull reports, start calls, file tickets and
          more.
        </Typography>

        <Button size="small" variant="outlined" sx={{ mt: 1.5, px: 1.5 }}>
          <Typography variant="h5" fontWeight={700}>
            Add an App
          </Typography>
        </Button>
      </FieldGroup>

      <FieldGroup>
        <Box display="flex" alignItems="center">
          <Typography component="span" fontWeight={700}>
            Send emails to this channel
          </Typography>
          <ProTag ml={1} />
        </Box>
        <Typography mt={0.5}>
          Get an email address that posts incoming emails in this channel.
        </Typography>

        <Button size="small" variant="outlined" sx={{ mt: 1.5, px: 1.5 }}>
          <Typography variant="h5" fontWeight={700}>
            See Upgrade Options
          </Typography>
        </Button>
      </FieldGroup>
    </Box>
  );
};

export default IntergrationTab;
