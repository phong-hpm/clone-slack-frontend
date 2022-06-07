import { useState, Fragment, useMemo } from "react";

// images
import defaultAvatar from "assets/images/default_avatar.png";

// store
import { useDispatch } from "store";

// redux store
import { useSelector } from "store";

// redux selector
import globalModalSelectors from "store/selectors/globalModal.selector";
import teamUsersSelectors from "store/selectors/teamUsers.selector";
import channelUsersSelectors from "store/selectors/channelUsers.selector";
import userSelectors from "store/selectors/user.selector";
import channelsSelectors from "store/selectors/channels.selector";

// redux actions
import { emitAddUserToChannel } from "store/actions/socket/channelSocket.action";
import { setOpenAddUserChannelModal } from "store/slices/globalModal.slice";

// components
import {
  Box,
  Button,
  Popper,
  Typography,
  TextField,
  Chip,
  Autocomplete,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderOptionState,
  AutocompleteRenderInputParams,
  Avatar,
  IconButton,
  Link,
} from "@mui/material";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "components/Modal";
import SlackIcon from "components/SlackIcon";
import UserMentionCard from "components/UserMentionCard";
import ProTag from "features/ProTag";

// utils
import { color, rgba } from "utils/constants";

// types
import { UserType } from "store/slices/_types";

interface OptionType {
  type?: "warning";
  status: "joined" | "not-joined" | "email";
  user: UserType;
}

const AddUserChannelChannel = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(globalModalSelectors.isOpenAddUserChannel);
  const userId = useSelector(userSelectors.getUserId);
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);
  const teamUserList = useSelector(teamUsersSelectors.getTeamUserList);
  const channelUserList = useSelector(channelUsersSelectors.getChannelUserList);

  const [selectedList, setSelectedList] = useState<OptionType[]>([]);

  const options = useMemo(() => {
    const result: OptionType[] = [];

    teamUserList.forEach((teamUser) => {
      const joined = !!channelUserList.find((channelUser) => channelUser.id === teamUser.id);
      result.push({ status: joined ? "joined" : "not-joined", user: teamUser });
    });

    return result;
  }, [channelUserList, teamUserList]);

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      autoFocus
      type="text"
      color="primary"
      placeholder="Search for channel or person"
    />
  );

  const handleSubmit = () => {
    if (!selectedChannel?.id || !selectedList.length) return;
    dispatch(
      emitAddUserToChannel({
        id: selectedChannel.id,
        userIds: selectedList.map((option) => option.user.id),
      })
    );
    handleClose();
  };

  const handleClose = () => {
    dispatch(setOpenAddUserChannelModal(false));
  };

  const renderTags = (getTagProps: AutocompleteRenderGetTagProps) => {
    return selectedList.map((option, index) => {
      const tagProps = getTagProps({ index });

      return (
        <Chip
          {...tagProps}
          color="secondary"
          avatar={
            <Box
              sx={{
                ml: "0 !important",
                bgcolor: "transparent !important",
                height: "auto !important",
              }}
            >
              <Avatar sizes="medium" src={option.user.avatar}>
                <img src={defaultAvatar} alt="" />
              </Avatar>
            </Box>
          }
          label={
            <Typography fontWeight={700} ml={0.5}>
              {option.user.name}
            </Typography>
          }
          deleteIcon={
            <IconButton size="small" sx={{ p: 0, borderRadius: 1, mr: "4px !important" }}>
              <SlackIcon icon="times-medium" color={color.HIGH} />
            </IconButton>
          }
          sx={{ p: 0, height: 26, borderRadius: 1, color: color.LIGHT }}
        />
      );
    });
  };

  const renderOption = (
    liProps: React.HTMLAttributes<HTMLLIElement>,
    option: OptionType,
    state?: AutocompleteRenderOptionState
  ) => {
    if (state?.selected) return <Fragment key={option.user.id} />;

    return (
      <li {...liProps} key={option.user.id} style={{ opacity: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Box flex="0 1 auto" overflow="hidden">
            <UserMentionCard
              userId={userId}
              userMention={option.user}
              color={option.status === "joined" ? color.HIGH : color.LIGHT}
              // cheat, force UserMentionCard's nodes won't be wrapped
              width="1000px"
            />
          </Box>
          {option.status === "joined" && (
            <Typography variant="h6" color={color.HIGH} ml={2} flex="1 0 auto" textAlign="right">
              Already in this channel
            </Typography>
          )}
        </Box>
      </li>
    );
  };

  return (
    <Modal isOpen={isOpen} isCloseBtn onClose={handleClose} onEnter={handleSubmit}>
      <ModalHeader>
        <Typography variant="h3">
          Add people to <SlackIcon icon="hash-medium-bold" style={{ fontSize: 22 }} />
          {selectedChannel?.name}
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Box>
          <Box>
            <Autocomplete
              multiple
              disablePortal
              options={options}
              size="small"
              noOptionsText="No matches found - try using their email instead"
              getOptionLabel={(option) => option.user.name}
              getOptionDisabled={({ status, type }) => type === "warning" || status === "joined"}
              PopperComponent={(props) => <Popper {...props} />}
              onChange={(_, value) => setSelectedList(value as OptionType[])}
              renderInput={renderInput}
              renderTags={(_, getTagProps) => renderTags(getTagProps)}
              renderOption={renderOption}
            />
          </Box>

          <Box display="flex" justifyContent="end" mt={3}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={!selectedList.length}
              onClick={handleSubmit}
            >
              Add
            </Button>
          </Box>
        </Box>
      </ModalBody>

      <ModalFooter
        bgcolor={rgba(color.MAX, 0.04)}
        style={{ borderTop: `1px solid ${color.LIGHT}` }}
      >
        <Box display="flex" alignItems="center">
          <Typography fontWeight={700} color={color.HIGH}>
            Try Slack Connect
          </Typography>
          <ProTag ml={1} />
        </Box>

        <Typography>
          Working with people at other companies? Simply type their email above to get started.
          <Link underline="hover" ml={0.5}>
            Learn more
          </Link>
        </Typography>
      </ModalFooter>
    </Modal>
  );
};

export default AddUserChannelChannel;
