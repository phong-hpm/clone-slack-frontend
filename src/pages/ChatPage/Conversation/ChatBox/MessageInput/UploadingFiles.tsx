import { FC, useContext } from "react";

// components
import { Box } from "@mui/material";
import UploadingFile, { UploadingFileProps } from "./UploadingFile";

// context
import ChatBoxContext from "./InputContext";

export interface UploadingFilesProps extends Omit<UploadingFileProps, "inputFile"> {}

const UploadingFiles: FC<UploadingFilesProps> = (props) => {
  const { appState } = useContext(ChatBoxContext);

  return (
    <Box display="flex" flexWrap="wrap" px={1.5} pt={1}>
      {appState.inputFiles.map((file) => {
        return <UploadingFile key={file.id} inputFile={file} {...props} />;
      })}
    </Box>
  );
};

export default UploadingFiles;
