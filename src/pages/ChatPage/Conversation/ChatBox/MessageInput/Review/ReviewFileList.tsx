import { FC, useContext } from "react";

// components
import { Box } from "@mui/material";
import ReviewAudioCard from "./ReviewAudioCard";
import ReviewVideoCard from "./ReviewVideoCard";
import ReviewImageCard from "./ReviewImageCard";

// context
import InputContext from "../InputContext";

export interface UploadingFileListProps {}

const UploadingFileList: FC<UploadingFileListProps> = () => {
  const { appState, removeInputFile } = useContext(InputContext);

  return (
    <Box display="flex" flexWrap="wrap" px={1.5} pt={1}>
      {appState.inputFiles.map((file) => (
        <Box key={file.id} mr={0.5}>
          {file.type === "image" && (
            <ReviewImageCard
              file={file}
              boxProps={{ sx: { mb: 1, mr: 1 } }}
              onRemove={() => removeInputFile(file.id)}
            />
          )}
          {file.type === "audio" && (
            <ReviewAudioCard
              height={34}
              width={143}
              data={{ src: file.url, duration: file.duration, wavePeaks: file.wavePeaks }}
              onRemove={() => removeInputFile(file.id)}
            />
          )}
          {file.type === "video" && (
            <ReviewVideoCard
              file={file}
              boxProps={{ sx: { mb: 1, mr: 1 } }}
              onRemove={() => removeInputFile(file.id)}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default UploadingFileList;
