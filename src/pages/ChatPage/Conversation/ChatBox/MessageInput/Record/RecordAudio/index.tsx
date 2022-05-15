import { FC } from "react";

import AudioRecordModal, { AudioRecordModalProps } from "./RecordAudioModal";

export interface AudioRecordProps extends AudioRecordModalProps {}

const AudioRecord: FC<AudioRecordProps> = ({ ...props }) => {
  return (
    <>
      <AudioRecordModal {...props} />
    </>
  );
};

export default AudioRecord;
