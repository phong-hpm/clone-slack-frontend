// redux store
import { useDispatch, useSelector } from "store";

// components
import ReactQuill from "react-quill";
import { Link, Typography, Box } from "@mui/material";
import SvgFileIcon from "components/SvgFileIcon";
import SlackIcon from "components/SlackIcon";

// redux selectors
import channelsSelectors from "store/selectors/channels.selector";

// utils
import { color } from "utils/constants";
import {
  setOpenAddUserChannelModal,
  setOpenEditChannelDescriptionModal,
} from "store/slices/globalModal.slice";

const MessageContentPanel = () => {
  const dispatch = useDispatch();

  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  if (!selectedChannel) return <></>;

  return (
    <Box px={2.5} py={5}>
      <Box display="flex">
        <Box mr={1} mt={0.5}>
          <SvgFileIcon
            icon={selectedChannel.type === "public_channel" ? "loudspeaker" : "message"}
            style={{ borderRadius: 4 }}
          />
        </Box>

        <Box>
          <Typography fontWeight={700}>
            {["public_channel", "general"].includes(selectedChannel.type) && (
              <>
                You're looking at the
                <Typography component="span" fontWeight="inherit" mx={0.5} color={color.HIGHLIGHT}>
                  <SlackIcon icon="channel-pane-hash" />
                  {selectedChannel.name}
                </Typography>
                channel
              </>
            )}
            {selectedChannel.type === "private_channel" && (
              <>
                This is the very beginning of the
                <Typography component="span" fontWeight="inherit" mx={0.5} color={color.HIGHLIGHT}>
                  <SlackIcon icon="lock-o" />
                  {selectedChannel.name}
                </Typography>
                channel
              </>
            )}

            {selectedChannel.type === "direct_message" && (
              <>This conversation is just between the two of you</>
            )}

            {selectedChannel.type === "group_message" && (
              <>This is the very beginning of your group conversation</>
            )}
          </Typography>

          {["public_channel", "general"].includes(selectedChannel.type) && (
            <Typography color={color.HIGH}>
              {selectedChannel.desc ||
                "This is the one channel that will always include everyone. It's a great spot for announcements and team-wide conversations."}
              <Link
                underline="hover"
                ml={0.5}
                onClick={() => dispatch(setOpenEditChannelDescriptionModal(true))}
              >
                {selectedChannel.desc ? "Edit description" : "Add description"}
              </Link>
            </Typography>
          )}

          {selectedChannel.type === "private_channel" && (
            <Typography color={color.HIGH}>
              {selectedChannel.desc ||
                "You created this channel on May 29th. It's private, and can only be joined by invitation."}
              <Link
                underline="hover"
                ml={0.5}
                onClick={() => dispatch(setOpenEditChannelDescriptionModal(true))}
              >
                {selectedChannel.desc ? "Edit description" : "Add description"}
              </Link>
            </Typography>
          )}

          {selectedChannel.type === "group_message" && (
            <Typography color={color.HIGH}>
              You'll be notified for every new message in this conversation.
              <Link underline="hover" ml={0.5}>
                Change this setting
              </Link>
            </Typography>
          )}

          {selectedChannel.type === "direct_message" && (
            <ReactQuill
              className="quill-editor"
              bounds={"#root"}
              defaultValue={`<p>Here you can send messages and share files with <span class="mention" data-id="${selectedChannel.partner?.id}" data-denotation-char="@" data-value="${selectedChannel.partner?.name}"></span></p>`}
              modules={{ toolbar: false, clipboard: { matchVisual: false } }}
              readOnly
            />
          )}
        </Box>
      </Box>

      {selectedChannel.type !== "direct_message" && (
        <Box>
          <Link
            component="div"
            underline="none"
            px={5.5}
            pt={3}
            onClick={() => dispatch(setOpenAddUserChannelModal(true))}
          >
            <SlackIcon icon="add-user" style={{ marginRight: 12 }} />
            Add people
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default MessageContentPanel;
