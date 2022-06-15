import { FC } from "react";

import RecordAudioModal, { RecordAudioModalProps } from "./RecordAudioModal";

export interface RecordAudioProps extends RecordAudioModalProps {}

const RecordAudio: FC<RecordAudioProps> = ({ ...props }) => {
  return <RecordAudioModal {...props} />;
};

export default RecordAudio;
