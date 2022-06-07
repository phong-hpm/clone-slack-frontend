// redux store
import { useDispatch, useSelector } from "store";

// redux selectors
import channelsSelectors from "store/selectors/channels.selector";

// redux slices
import {
  setOpenArchiveChannelModal,
  setOpenEditChannelNameModal,
} from "store/slices/globalModal.slice";

// components
import { Box, Typography, Link, Tooltip, IconButton } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import ProTag from "features/ProTag";

// utils
import { color } from "utils/constants";

// types
import FieldGroup from "components/FieldGroup";

const SettingTab = () => {
  const dispatch = useDispatch();

  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  if (!selectedChannel) return <></>;

  const isShowArchive = selectedChannel.type === "public_channel";
  const isShowHuddles = selectedChannel.type !== "group_message";
  const isShowChangetoPrivate = !isShowHuddles;

  return (
    <Box id="test" flexGrow={1}>
      {isShowHuddles && (
        <FieldGroup>
          <Box display="flex" justifyContent="space-between" color={color.HIGH}>
            <Box display="flex" alignItems="center">
              <Typography component="span" fontWeight={700}>
                Huddles
              </Typography>
              <ProTag ml={1} />
            </Box>

            <Tooltip placement="bottom" title="Help">
              <IconButton size="small" sx={{ borderRadius: 1 }}>
                <SlackIcon fontSize="large" icon="help" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography mt={0.5}>
            Members can start and join huddles in this channel.
            <Link underline="hover" ml={0.5}>
              Learn more
            </Link>
          </Typography>
        </FieldGroup>
      )}

      {isShowArchive && (
        <FieldGroup onClick={() => dispatch(setOpenArchiveChannelModal(true))}>
          <Typography color={color.DANGER} fontWeight={700}>
            <SlackIcon icon="archive" style={{ marginRight: 8 }} />
            Archive channel for everyone
          </Typography>
        </FieldGroup>
      )}

      {isShowChangetoPrivate && (
        <FieldGroup onClick={() => dispatch(setOpenEditChannelNameModal(true))}>
          <Typography fontWeight={700}>
            <SlackIcon icon="lock" style={{ marginRight: 8 }} />
            Change to a private channel
          </Typography>
        </FieldGroup>
      )}
    </Box>
  );
};

export default SettingTab;
