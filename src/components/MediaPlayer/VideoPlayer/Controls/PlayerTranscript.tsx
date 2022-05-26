import { FC, useContext, useRef, useState } from "react";

// components
import { Tooltip } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import IconButtonCustom from "./IconButtonCustom";
import TranscriptModal from "../TranscriptModal";

// context
import { VideoPlayerContext } from "../VideoPlayerContext";

export interface PlayerTranscriptProps {
  onChange: (time: number) => void;
}

const PlayerTranscript: FC<PlayerTranscriptProps> = ({ onChange }) => {
  const { state, updateState } = useContext(VideoPlayerContext);

  const transcriptButtonRef = useRef<HTMLButtonElement>(null);

  const [isShowTranscriptModal, setShowTranscriptModal] = useState(false);

  const handleClickButton = () => {
    if (state.isFullScreen) {
      updateState({ isShowThreadScriptBar: true });
    } else {
      setShowTranscriptModal(true);
    }
  };

  if (!state.scripts?.length || !state.userOwner || !state.createdTime) return <></>;

  return (
    <>
      <Tooltip title={state.isFullScreen ? "Show thread & transcript" : "View transcript"}>
        <IconButtonCustom ref={transcriptButtonRef} onClick={handleClickButton}>
          <SlackIcon icon={state.isFullScreen ? "side-panel" : "list"} />
        </IconButtonCustom>
      </Tooltip>

      {!state.isFullScreen && (
        <TranscriptModal
          isOpen={isShowTranscriptModal}
          anchorEl={transcriptButtonRef.current}
          scripts={state.scripts}
          createdTime={state.createdTime}
          user={state.userOwner}
          onClickScript={onChange}
          onClose={() => setShowTranscriptModal(false)}
        />
      )}
    </>
  );
};

export default PlayerTranscript;
