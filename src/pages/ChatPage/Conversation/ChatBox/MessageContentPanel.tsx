// redux store
import { useSelector } from "store";

// components
import ReactQuill from "react-quill";
import { Link, Typography, Box } from "@mui/material";
import SvgFileIcon from "components/SvgFileIcon";

// redux selectors
import channelsSelectors from "store/selectors/channels.selector";

// utils
import { color } from "utils/constants";
import SlackIcon from "components/SlackIcon";

const MessageContentPanel = () => {
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  if (!selectedChannel) return <></>;

  return (
    <Box px={2.5} py={1}>
      <Box display="flex">
        <Box mr={1}>
          <SvgFileIcon
            icon={selectedChannel.type === "channel" ? "loudspeaker" : "message"}
            style={{ borderRadius: 4 }}
          />
        </Box>

        <Box>
          <Typography fontWeight={700}>
            {selectedChannel.type === "channel" && (
              <>
                You're looking at the
                <Typography component="span" fontWeight="inherit" mx={0.5} color={color.HIGHLIGHT}>
                  #{selectedChannel.name}
                </Typography>
                channel
              </>
            )}

            {selectedChannel.type === "direct_message" && (
              <>This conversation is just between the two of you</>
            )}

            {selectedChannel.type === "direct_message" && (
              <>This is the very beginning of your group conversation</>
            )}
          </Typography>

          {selectedChannel.type === "channel" && (
            <Typography color={color.HIGH}>
              This is the one channel that will always include everyone. It's a great spot for
              announcements and team-wide conversations.
              <Link underline="hover" ml={0.5}>
                Edit description
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

      <Box>
        <Link component="div" underline="none" px={5.5} py={3}>
          <SlackIcon icon="add-user" style={{ marginRight: 12 }} />
          Add people
        </Link>
      </Box>
    </Box>
  );
};

export default MessageContentPanel;
