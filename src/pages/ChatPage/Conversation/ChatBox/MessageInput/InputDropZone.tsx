import { useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuid } from "uuid";

// components
import { Box } from "@mui/material";

// context
import InputContext from "./InputContext";

const InputDropZone = () => {
  const { setInputFile } = useContext(InputContext);

  const [isDragingWrapper, setDragingWrapper] = useState(false);
  const [isDragingZone, setDragingZone] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    noClick: true,
    accept: { "image/*": [] },
    onDragEnter: () => setDragingZone(true),
    onDragLeave: () => setDragingZone(false),
    onDrop: (acceptedFiles) => {
      setDragingZone(false);
      acceptedFiles.forEach((file) => {
        setInputFile({
          id: `F-${uuid()}`,
          url: URL.createObjectURL(file),
          createdTime: Date.now(),
          type: "image",
          mineType: file.type as any,
        });
      });
    },
  });

  // listening draging and drop event in body, will help us control DropZone any where
  // Because we have to use [InputContext] for setting uploading file to [MessageInput],
  //   and we are allowing user drag files over [MessageContentList].
  //   Besides, we don't want to render [MessageContentList] as a children of [InputContext],
  //   it will effect to [MessageContentList] performance
  useEffect(() => {
    const conversationMain = document.getElementById("conversation-main");
    if (!conversationMain) return;

    const handleDragOver = () => setDragingWrapper(true);
    const handleDragLeave = () => setDragingWrapper(false);
    const handleDrop = () => setDragingWrapper(false);

    conversationMain.addEventListener("dragover", handleDragOver);
    conversationMain.addEventListener("dragleave", handleDragLeave);
    conversationMain.addEventListener("drop", handleDrop);

    return () => {
      conversationMain.removeEventListener("dragover", handleDragOver);
      conversationMain.removeEventListener("dragleave", handleDragLeave);
      conversationMain.removeEventListener("drop", handleDrop);
    };
  }, []);

  return (
    <Box
      {...getRootProps({ className: "dropzone" })}
      zIndex={isDragingZone || isDragingWrapper ? 1500 : -1}
      position="absolute"
      left={0}
      right={0}
      top={0}
      bottom={0}
      bgcolor="rgba(26, 29, 33, 0.9)"
    >
      <input data-testid="dropzone" {...getInputProps()} />
    </Box>
  );
};

export default InputDropZone;
