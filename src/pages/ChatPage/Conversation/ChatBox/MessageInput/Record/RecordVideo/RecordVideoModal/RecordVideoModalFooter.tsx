import { FC } from "react";

// components
import { ModalFooter } from "components/Modal";
import { Box, Button, Typography, Slider } from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import { color } from "utils/constants";

// types
import { StatusType } from "./_types";

// sounds
import { buildProgressTime } from "utils/waveSurver";

export interface RecordVideoModalFooterProps {
  isDisabledRecord: boolean;
  isShareScreen: boolean;
  isPlaying: boolean;
  duration: number;
  status: StatusType;
  setStatus: (status: StatusType) => void;
  togglePlaying: () => void;
  toggleShareScreen: () => void;
  onDone: () => void;
}

const RecordVideoModalFooter: FC<RecordVideoModalFooterProps> = ({
  isDisabledRecord,
  isShareScreen,
  isPlaying,
  duration,
  status,
  setStatus,
  togglePlaying,
  toggleShareScreen,
  onDone,
}) => {
  return (
    <ModalFooter>
      <Box sx={{ opacity: status === "recording" ? 1 : 0 }}>
        <Slider
          value={duration}
          min={0}
          max={300}
          componentsProps={{ thumb: { style: { display: "none" } } }}
        />
      </Box>

      <Box display="flex" justifyContent="space-between">
        {status === "recording" && (
          <Box>
            <Typography lineHeight={2.5} sx={{ ml: 1 }}>
              {`${buildProgressTime(duration)} / ${buildProgressTime(300)}`}
            </Typography>
          </Box>
        )}
        <Box>
          {/* upload video button */}
          {status === "active" && (
            <Button variant="text" size="large" sx={{ ml: -1.25, color: color.HIGH }}>
              <SlackIcon icon="cloud-upload" />
              <Typography fontWeight={700} sx={{ ml: 1 }}>
                Upload video
              </Typography>
            </Button>
          )}
        </Box>

        <Box>
          {/* sharescreen button */}
          {status !== "counting" && (
            <Button
              variant="text"
              size="large"
              sx={{ color: color.HIGH }}
              onClick={toggleShareScreen}
            >
              <SlackIcon icon={isShareScreen ? "stop-screen-sharing-alt" : "share-screen"} />
              <Typography fontWeight={700} sx={{ ml: 1 }}>
                {isShareScreen ? "Stop sharing" : "Share screen"}
              </Typography>
            </Button>
          )}

          {/* pause/resume button */}
          {status === "recording" && (
            <Button variant="text" size="large" sx={{ color: color.HIGH }} onClick={togglePlaying}>
              <SlackIcon icon={isPlaying ? "pause" : "play"} />
              <Typography fontWeight={700} sx={{ ml: 1 }}>
                {isPlaying ? "Pause" : "Resume"}
              </Typography>
            </Button>
          )}

          {/* record button */}
          <Button
            variant="contained"
            color="error"
            size="large"
            sx={{ ml: 2 }}
            disabled={isDisabledRecord}
            onClick={() => {
              if (status === "active") setStatus("counting");
              else if (status === "counting") setStatus("active");
              else onDone();
            }}
          >
            {status === "active" ? "Record" : "Stop"}
          </Button>
        </Box>
      </Box>
    </ModalFooter>
  );
};

export default RecordVideoModalFooter;
