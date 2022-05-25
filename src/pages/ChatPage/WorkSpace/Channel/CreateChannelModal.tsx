import { FC, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";

// components
import {
  Box,
  Button,
  InputAdornment,
  Popper,
  Switch,
  Typography,
  TextField,
  Link,
} from "@mui/material";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "components/Modal";
import SlackIcon from "components/SlackIcon";

// hooks
import useChannelSocket from "pages/ChatPage/hooks/useChannelSocket";

// utils
import { color } from "utils/constants";

const learnMoreUrl =
  "https://slack.com/help/articles/360017938993-What-is-a-channel?utm_medium=in-prod&utm_source=in-prod&utm_campaign=cd_in-prod_in-prod_all_en_sharedchannels-betterinvites_cr-create-channel_ym-201911";

const nameSuggestions = [
  { label: "help", desc: "For questions, assistance, and resources on a topic" },
  { label: "proj", desc: "For collaboration on and discussion about a project" },
  { label: "team", desc: "For updates and work from a department or team" },
];

export interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateChannelModal: FC<CreateChannelModalProps> = ({ isOpen, onClose }) => {
  const { handleSendChannel } = useChannelSocket();

  const [error, setError] = useState({ maxLength: false, minLength: false });
  const [isPrivate, setIsPrivate] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [desc, setDesc] = useState("");

  const handleChangeChannelName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (value.length > 80) {
      setError({ maxLength: true, minLength: false });
    }
    setChannelName(e.target.value);
  };

  const handleBlurChannelName = () => {
    if (!channelName.length) {
      setError({ maxLength: false, minLength: true });
    }
  };

  const handleSubmit = () => {
    handleSendChannel(channelName, desc);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} isCloseBtn onClose={onClose}>
      <ModalHeader>
        <Typography variant="h2">
          {isPrivate ? "Create a private channel" : "Create a channel"}
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Typography color={color.MAX_SOLID}>
          Channels are where your team communicates. They're best when organized around a topic —
          #marketing, for example.
        </Typography>

        <Box mt={3}>
          <Box display="flex">
            <Typography fontWeight={700}>Name</Typography>
            {error.minLength && (
              <Typography fontWeight={700} color={color.WARM} sx={{ ml: 1 }}>
                Don't forget to name your channel.
              </Typography>
            )}
            {error.maxLength && (
              <Typography fontWeight={700} color={color.WARM} sx={{ ml: 1 }}>
                Channel names can't be longer than 80 characters.
              </Typography>
            )}
          </Box>
          <Box mt={1}>
            <Autocomplete
              disablePortal
              freeSolo
              disableClearable
              options={nameSuggestions}
              PopperComponent={(props) => <Popper {...props} />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  type="text"
                  color="primary"
                  placeholder="e.g. plan-budget"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: -1 }}>
                        <SlackIcon icon={isPrivate ? "lock" : "channel-pane-hash"} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end" sx={{ pr: 1, ml: -1 }}>
                        {80 - channelName.length}
                      </InputAdornment>
                    ),
                  }}
                  value={channelName}
                  onChange={handleChangeChannelName}
                  onBlur={handleBlurChannelName}
                />
              )}
              renderOption={(liProps, { label, desc }) => {
                return (
                  <li {...liProps}>
                    <span className="label">{label}</span>
                    <span>&nbsp;-&nbsp;</span>
                    <span>{desc}</span>
                  </li>
                );
              }}
            />
          </Box>
        </Box>

        <Box mt={3}>
          <Box display="flex">
            <Typography fontWeight={700}>Description</Typography>
            <Typography color={color.MAX_SOLID} sx={{ ml: 0.5 }}>
              (optional)
            </Typography>
          </Box>
          <Box mt={1}>
            <TextField
              type="text"
              fullWidth
              InputProps={{ sx: { px: 0, py: 0.5 } }}
              onBlur={(e) => setDesc(e.target.value)}
            />
          </Box>
          <Box mt={0.5}>
            <Typography variant="h5" color={color.MAX_SOLID}>
              What's this channel about?
            </Typography>
          </Box>
        </Box>

        <Box mt={2.5} display="flex" justifyContent="space-between" alignItems="center">
          <Box mr={5} maxWidth={300}>
            <Typography fontWeight="bold">Make private</Typography>
            <Typography color={color.MAX_SOLID}>
              {isPrivate ? (
                <>
                  <strong>This can't be undone.</strong> A private channel cannot be made public
                  later on.
                </>
              ) : (
                "When a channel is set to private, it can only be viewed or joined by invitation."
              )}
            </Typography>
          </Box>
          <Box position="relative">
            <Switch checked={isPrivate} onChange={(_, checked) => setIsPrivate(checked)} />
            {isPrivate && (
              <Box position="absolute" top="5px" left="7px">
                <SlackIcon icon="form-checkbox-check" />
              </Box>
            )}
          </Box>
        </Box>
      </ModalBody>

      <ModalFooter>
        <Box display="flex" justifyContent="space-between">
          <Box color={color.MAX_SOLID}>
            <SlackIcon icon="info-circle" fontSize="medium" />
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={learnMoreUrl}
              underline="hover"
              color="inherit"
              ml={2}
            >
              Learn more
            </Link>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={!channelName}
            onClick={handleSubmit}
          >
            Create
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default CreateChannelModal;
