import { useEffect, useState } from "react";

// redux store
import { useDispatch, useSelector } from "store";

// redux selector
import userSelectors from "store/selectors/user.selector";
import channelsSelectors from "store/selectors/channels.selector";
import channelUsersSelectors from "store/selectors/channelUsers.selector";

// components
import { Box, Typography, Link, Tooltip } from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import { color, routePaths } from "utils/constants";

// types
import FieldGroup from "components/FieldGroup";
import { dayFormat } from "utils/dayjs";
import {
  setOpenChannelDetailModal,
  setOpenEditChannelDescriptionModal,
  setOpenEditChannelNameModal,
  setOpenEditChannelTopicModal,
} from "store/slices/globalModal.slice";
import { emitUserLeaveChannel } from "store/actions/socket/channelSocket.action";
import { useNavigate, useParams } from "react-router-dom";
import { UserType } from "store/slices/_types";

const AboutTab = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teamId } = useParams();

  const userId = useSelector(userSelectors.getUserId);
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);
  const channelsList = useSelector(channelsSelectors.getChannelList);
  const channelUserList = useSelector(channelUsersSelectors.getChannelUserList);

  const [creator, setCreator] = useState<UserType>();

  useEffect(() => {
    setCreator(channelUserList.find((user) => user.id === selectedChannel?.creator));
  }, [selectedChannel, channelUserList]);

  const renderFieldGroupContent = ({
    title,
    desc,
    editable = true,
  }: {
    title: string;
    desc: string;
    editable?: boolean;
  }) => {
    return (
      <>
        <Box display="flex" justifyContent="space-between">
          <Typography component="span" fontWeight={700}>
            {title}
          </Typography>

          {editable && (
            <Link underline="hover" ml={0.5}>
              <Typography variant="h5" fontWeight={700}>
                Edit
              </Typography>
            </Link>
          )}
        </Box>
        <Typography color={color.HIGH} mt={0.5} sx={{ whiteSpace: "pre-line" }}>
          {desc}
        </Typography>
      </>
    );
  };

  if (!selectedChannel) return <></>;

  const isShowLeave = ["public_channel", "private_channel"].includes(selectedChannel.type);
  const isShowChannelName = userId === selectedChannel.creator && isShowLeave;
  const isShowOptionalFields = selectedChannel.type === "general" || isShowLeave;

  return (
    <Box>
      {isShowChannelName && (
        <FieldGroup onClick={() => dispatch(setOpenEditChannelNameModal(true))}>
          {renderFieldGroupContent({ title: "Channel name", desc: `# ${selectedChannel.name}` })}
        </FieldGroup>
      )}

      {selectedChannel.partner && (
        <FieldGroup>
          <Typography sx={{ whiteSpace: "pre-line" }}>
            <SlackIcon icon="clock-o" style={{ marginRight: 8 }} />
            {dayFormat.timeA(Date.now())} local time
          </Typography>
          <Typography mt={1} sx={{ whiteSpace: "pre-line" }}>
            <SlackIcon icon="envelope-o" style={{ marginRight: 8 }} />
            <Link underline="hover">{selectedChannel.partner.email}</Link>
          </Typography>
          <Typography mt={1.5}>
            <Link underline="hover" fontWeight={700}>
              View full profile
            </Link>
          </Typography>
        </FieldGroup>
      )}

      {isShowOptionalFields && (
        <>
          <FieldGroup isGroupHead onClick={() => dispatch(setOpenEditChannelTopicModal(true))}>
            {renderFieldGroupContent({
              title: "Topic",
              desc: selectedChannel.topic || "Add a topic",
            })}
          </FieldGroup>

          <FieldGroup
            isGroupBody
            onClick={() => dispatch(setOpenEditChannelDescriptionModal(true))}
          >
            {renderFieldGroupContent({
              title: "Description",
              desc: selectedChannel.desc || "Add a description",
            })}
          </FieldGroup>

          <FieldGroup isGroupBody={isShowLeave} isGroupFooter={!isShowLeave} onClick={() => {}}>
            {renderFieldGroupContent({
              title: "Created by",
              desc: `${creator?.name || ""} on ${dayFormat.fullDay(selectedChannel.createdTime)}`,
            })}
          </FieldGroup>

          {isShowLeave && (
            <FieldGroup
              isGroupFooter
              onClick={() => {
                dispatch(setOpenChannelDetailModal(false));
                dispatch(emitUserLeaveChannel({ id: selectedChannel.id }));
                navigate(`${routePaths.CHATBOX_PAGE}/${teamId}/${channelsList[0].id}`);
              }}
            >
              <Typography color={color.DANGER} fontWeight={700}>
                Leave Channel
              </Typography>
            </FieldGroup>
          )}
        </>
      )}

      <FieldGroup>
        {renderFieldGroupContent({
          editable: false,
          title: "Files",
          desc: "There aren't any files to see here right now. But there could be — drag and drop any file into the message pane to add it to this conversation.",
        })}
      </FieldGroup>

      <Box px={5.5} color={color.HIGH}>
        <Typography component="span" variant="h5" mr={1}>
          Channel ID: {selectedChannel.id}
        </Typography>
        <Tooltip title="Copy channel id">
          <Typography
            component="span"
            variant="h5"
            mr={1}
            style={{ cursor: "pointer" }}
            onClick={() => navigator.clipboard.writeText(selectedChannel.id)}
          >
            <SlackIcon fontSize="small" icon="new-window"></SlackIcon>
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default AboutTab;
