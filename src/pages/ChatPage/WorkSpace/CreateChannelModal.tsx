import { FC, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";

// redux store
import { useSelector } from "../../../store";

// redux selector
import * as authSelectors from "../../../store/selectors/auth.selector";

// components
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../../components/Modal";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Popper,
  Switch,
  Typography,
  TextField,
} from "@mui/material";

// icons
import IconLock from "@mui/icons-material/Lock";
import IconTag from "@mui/icons-material/Tag";
import IconDone from "@mui/icons-material/Done";

export interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, desc: string) => void;
}

const nameSuggestions = [
  { label: "help", desc: "For questions, assistance, and resources on a topic" },
  { label: "proj", desc: "For collaboration on and discussion about a project" },
  { label: "team", desc: "For updates and work from a department or team" },
];

const CreateChannelModal: FC<CreateChannelModalProps> = ({ isOpen, onSubmit, onClose }) => {
  const user = useSelector(authSelectors.getUser);

  const [isPrivate, setIsPrivate] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = () => {
    onSubmit(channelName, desc);
  };

  return (
    <div>
      <Modal isOpen={isOpen} isCloseBtn onClose={onClose}>
        <ModalHeader>{isPrivate ? "Create a private channel" : "Create a channel"}</ModalHeader>
        <ModalBody>
          <Typography>
            Channels are where your team communicates. They're best when organized around a topic —
            #marketing, for example.
          </Typography>

          <Box mt={3}>
            <Typography>
              <strong>Name</strong>
            </Typography>
            <Box mt={1}>
              <Autocomplete
                disablePortal
                freeSolo
                options={nameSuggestions}
                PopperComponent={(props) => <Popper {...props} />}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    color="primary"
                    placeholder="e.g. plan-budget"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          {isPrivate ? (
                            <IconLock fontSize="inherit" />
                          ) : (
                            <IconTag fontSize="inherit" />
                          )}
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">{80 - channelName.length}</InputAdornment>
                      ),
                    }}
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
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
            <Typography>
              <strong>Description</strong> (optional)
            </Typography>
            <Box mt={1}>
              <TextField fullWidth onBlur={(e) => setDesc(e.target.value)} />
            </Box>
            <Box mt={0.5}>
              <Typography variant="h5">What's this channel about?</Typography>
            </Box>
          </Box>

          <Box mt={2.5} display="flex" alignItems="center">
            <Box mr={5}>
              <Typography>
                <strong>Make private</strong>
              </Typography>
              <Typography>
                When a channel is set to private, it can only be viewed or joined by invitation.
              </Typography>
            </Box>
            <Box position="relative">
              <Switch checked={isPrivate} onChange={(_, checked) => setIsPrivate(checked)} />
              {isPrivate && (
                <Box position="absolute" top="7px" left="10px">
                  <IconDone fontSize="inherit" />
                </Box>
              )}
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Box display="flex" justifyContent="space-between">
            <Box>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox size="small" defaultChecked />}
                  label={`Share outside ${user.name}`}
                />
              </FormGroup>
            </Box>
            <Button variant="contained" color="primary" size="medium" onClick={handleSubmit}>
              Create
            </Button>
          </Box>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CreateChannelModal;
