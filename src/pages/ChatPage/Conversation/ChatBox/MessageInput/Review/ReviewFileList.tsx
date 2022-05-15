import { FC, useContext } from "react";

// components
import { Box } from "@mui/material";
import ReviewAudioCard from "./ReviewAudioCard";
import ReviewVideoCard from "./ReviewVideoCard";

// context
import InputContext from "../InputContext";

export interface UploadingFileListProps {}

const UploadingFileList: FC<UploadingFileListProps> = () => {
  const { appState, removeInputFile } = useContext(InputContext);

  return (
    <Box display="flex" flexWrap="wrap" px={1.5} pt={1}>
      {appState.inputFiles.map((file) => (
        <Box key={file.id} mr={0.5}>
          {file.type === "audio" ? (
            <ReviewAudioCard
              isRemove
              height={34}
              width={143}
              file={file}
              onRemove={() => removeInputFile(file.id)}
            />
          ) : (
            <ReviewVideoCard file={file} onRemove={() => removeInputFile(file.id)} />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default UploadingFileList;
