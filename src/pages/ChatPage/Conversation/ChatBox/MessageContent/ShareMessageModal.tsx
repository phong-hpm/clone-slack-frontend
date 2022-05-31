import React, { FC, Fragment, useMemo, useState } from "react";

// images
import defaultAvatar from "assets/images/default_avatar.png";

// redux store
import { useSelector } from "store";

// redux selector
import * as authSelectors from "store/selectors/auth.selector";
import * as channelsSelectors from "store/selectors/channels.selector";

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

// hooks
import useMessageSocket from "pages/ChatPage/hooks/useMessageSocket";

// utils
import { color } from "utils/constants";

// types
import { Delta } from "quill";
import { ChannelType, MessageType } from "store/slices/_types";
import UserAvatarLength from "components/UserAvatarLength";

export interface ShareMessageModalProps {
  isOpen: boolean;
  message: MessageType;
  onClose: () => void;
}

const ShareMessageModal: FC<ShareMessageModalProps> = ({ isOpen, message, onClose }) => {
  const { emitShareMessageToChannel, emitShareMessageToGroupUsers } = useMessageSocket();

  const user = useSelector(authSelectors.getUser);
  const channelList = useSelector(channelsSelectors.getChannelList);
  const directMessageList = useSelector(channelsSelectors.getDirectMessagesList);

  const [selectedList, setSelectedList] = useState<ChannelType[]>([]);
  const [messageDelta, setMessageDelta] = useState<Delta>({} as Delta);
  const [selectingType, setSelectingType] = useState<ChannelType["type"] | "">("");

  const channelOptions = useMemo(() => {
    let options: ChannelType[] = [];

    if (selectingType === "direct_message") {
      if (directMessageList.length === selectedList.length) {
        options = [];
      } else {
        options = directMessageList.filter((item) => item.type === "direct_message");
      }
    } else if (selectingType === "channel" || selectingType === "group_message") {
      options = [
        {
          id: "warning",
          name: `Can't share with more than 1 ${
            selectingType === "group_message" ? "group message" : "channel"
          }`,
        } as ChannelType,
      ];
    } else {
      options = [...channelList, ...directMessageList];
    }

    if (!options?.length) {
      options = [{ id: "warning", name: "No items" } as ChannelType];
    }

    return options;
  }, [selectingType, selectedList, directMessageList, channelList]);

  const handleSubmit = () => {
    onClose();

    if (!selectedList.length) return;

    if (selectedList.length === 1) {
      emitShareMessageToChannel(selectedList[0].id, messageDelta, message.id);
    } else if (selectingType === "direct_message") {
      const toUserIds = selectedList.map((c) => c.partner!.id);
      emitShareMessageToGroupUsers(toUserIds, messageDelta, message.id);
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
              {option.type === "channel" ? (
                <Box m={0.25}>
                  <SlackIcon icon="hash-medium" color={color.LIGHT} />
                </Box>
              ) : (
                <Avatar sizes="medium" src={avatar}>
                  <img src={defaultAvatar} alt="" />
                </Avatar>
              )}
            </Box>
          }
          label={
            <Typography fontWeight={700} ml={option.type === "channel" ? -0.5 : 0.5}>
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
            <Typography fontWeight={700}>{option.name || "unknow"}</Typography>
          </Box>
        </Box>
      </li>
    );
  };

  return (
    <Modal isOpen={isOpen} isCloseBtn onClose={onClose}>
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
