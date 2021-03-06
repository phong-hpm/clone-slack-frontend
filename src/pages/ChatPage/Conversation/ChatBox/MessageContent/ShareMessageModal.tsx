import React, { FC, Fragment, useMemo, useState } from "react";

// images
import defaultAvatar from "assets/images/default_avatar.png";

// redux store
import { useDispatch, useSelector } from "store";

// redux selector
import userSelectors from "store/selectors/user.selector";
import channelsSelectors from "store/selectors/channels.selector";

// redux actions
import {
  emitShareMessageToChannel,
  emitShareMessageToGroupUsers,
} from "store/actions/socket/messageSocket.action";

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
} from "@mui/material";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "components/Modal";
import SlackIcon from "components/SlackIcon";
import UserMentionCard from "components/UserMentionCard";
import MessageInput from "../MessageInput";
import MessageShared from "../MessageShared";
import UserAvatarLength from "components/UserAvatarLength";

// utils
import { color } from "utils/constants";

// types
import { Delta } from "quill";
import { ChannelType, MessageType } from "store/slices/_types";

export interface ShareMessageModalProps {
  isOpen: boolean;
  message: MessageType;
  onClose: () => void;
}

const ShareMessageModal: FC<ShareMessageModalProps> = ({ isOpen, message, onClose }) => {
  const dispatch = useDispatch();

  const user = useSelector(userSelectors.getUser);
  const channelList = useSelector(channelsSelectors.getChannelList);

  const [selectedList, setSelectedList] = useState<ChannelType[]>([]);
  const [messageDelta, setMessageDelta] = useState<Delta>({} as Delta);
  const [selectingType, setSelectingType] = useState<ChannelType["type"] | "">("");

  const channelOptions = useMemo(() => {
    let options: ChannelType[] = [];

    if (!selectingType) {
      options = channelList;
    } else if (selectingType === "direct_message") {
      options = channelList.filter((item) => item.type === "direct_message");
      if (selectedList.length === options.length) options = [];
    } else {
      options = [{ id: "warning", name: `Can't share with more than 1 channel` } as ChannelType];
    }

    if (!options?.length) {
      options = [{ id: "warning", name: "No items" } as ChannelType];
    }

    return options;
  }, [selectingType, selectedList, channelList]);

  const handleSubmit = () => {
    onClose();

    if (selectedList.length === 1) {
      // Share to only 1 channel, it can be a direct_message
      dispatch(
        emitShareMessageToChannel({
          toChannelId: selectedList[0].id,
          delta: messageDelta,
          sharedMessageId: message.id,
        })
      );
    } else if (selectedList.length > 1 && selectingType === "direct_message") {
      // Share to a group channel, it can be created if didn't exist
      const toUserIds = selectedList.map((c) => c.partner!.id);
      dispatch(
        emitShareMessageToGroupUsers({
          toUserIds,
          delta: messageDelta,
          sharedMessageId: message.id,
        })
      );
    }
  };

  const handleChangeSelectedList = (list: ChannelType[]) => {
    if (!list.length) setSelectingType("");
    else if (list.length === 1) setSelectingType(list[0].type);

    setSelectedList(list);
  };

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      autoFocus
      type="text"
      color="primary"
      placeholder="Search for channel or person"
    />
  );

  const renderTags = (getTagProps: AutocompleteRenderGetTagProps) => {
    return selectedList.map((option, index) => {
      const avatar = option.avatar || option.partner?.avatar;

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
              {["public_channel", "general"].includes(option.type) && (
                <Box m={0.25}>
                  <SlackIcon icon="hash-medium" color={color.LIGHT} />
                </Box>
              )}
              {option.type === "private_channel" && (
                <Box m={0.25}>
                  <SlackIcon icon="lock-o" color={color.LIGHT} />
                </Box>
              )}
              {option.type === "direct_message" && (
                <Avatar sizes="medium" src={avatar}>
                  <img src={defaultAvatar} alt="" />
                </Avatar>
              )}
              {option.type === "group_message" && (
                <Box color={color.PRIMARY}>
                  <UserAvatarLength
                    src={option.avatar}
                    length={option.users.length - 1}
                    sizes="small"
                  />
                </Box>
              )}
            </Box>
          }
          label={
            <Typography
              fontWeight={700}
              ml={["public_channel", "general"].includes(option.type) ? -0.5 : 0.5}
            >
              {option.name}
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
    option: ChannelType,
    state?: AutocompleteRenderOptionState
  ) => {
    if (state?.selected) return <Fragment key={option.id} />;

    if (option.type === "direct_message") {
      return (
        <li {...liProps} key={option.id}>
          <UserMentionCard userId={user.id} userMention={option.partner} />
        </li>
      );
    }

    return (
      <li {...liProps} key={option.id}>
        <Box display="flex" color={color.PRIMARY}>
          <Box p={0.5}>
            {option.type === "group_message" ? (
              <UserAvatarLength src={option.avatar} length={option.users.length - 1} />
            ) : (
              <SlackIcon icon="channel-pane-hash" />
            )}
          </Box>
          <Box p={0.5}>
            <Typography fontWeight={700}>{option.name}</Typography>
          </Box>
        </Box>
      </li>
    );
  };

  return (
    <Modal isOpen={isOpen} isCloseBtn onEnter={handleSubmit} onClose={onClose}>
      <ModalHeader>
        <Typography variant="h2">Share this message</Typography>
      </ModalHeader>
      <ModalBody>
        <Box mt={1} color={color.PRIMARY}>
          <Autocomplete
            multiple
            disablePortal
            options={channelOptions}
            size="small"
            noOptionsText="No items"
            getOptionLabel={(option) => (option as ChannelType).name}
            getOptionDisabled={(option) => option.id === "warning"}
            PopperComponent={(props) => <Popper {...props} />}
            onChange={(_, value) => handleChangeSelectedList(value as ChannelType[])}
            renderInput={renderInput}
            renderTags={(_, getTagProps) => renderTags(getTagProps)}
            renderOption={renderOption}
          />
        </Box>

        <Box mt={2}>
          <MessageInput
            placeHolder="Add a message, if you'd like."
            configActions={{ emoji: true, mention: true }}
            onBlur={(delta) => setMessageDelta(delta)}
          />
        </Box>

        <Box mt={2}>
          <MessageShared
            isMessageOnly
            isHideMessageTime
            message={message}
            lineColor={color.MID_SOLID}
          />
        </Box>
      </ModalBody>

      <ModalFooter>
        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" size="large">
            Copy Link
          </Button>
          <Box>
            <Button variant="outlined" size="large" sx={{ mr: 1.5 }}>
              Save Draft
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={!selectedList.length}
              onClick={handleSubmit}
            >
              Share
            </Button>
          </Box>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default ShareMessageModal;
