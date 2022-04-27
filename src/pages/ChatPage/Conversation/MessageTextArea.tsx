import { FC, useRef, useState } from "react";

// css
import "react-quill/dist/quill.snow.css";

// components
import { Box } from "@mui/material";
import { Delta, Sources, BoundsStatic, RangeStatic, DeltaStatic } from "quill";
import ReactQuill from "react-quill";

interface UnprivilegedEditor {
  getLength(): number;
  getText(index?: number, length?: number): string;
  getHTML(): string;
  getBounds(index: number, length?: number): BoundsStatic;
  getSelection(focus?: boolean): RangeStatic;
  getContents(index?: number, length?: number): DeltaStatic;
}

export interface MessageTextAreaProps {
  onSend: (text: string) => void;
}

const MessageTextArea: FC<MessageTextAreaProps> = ({ onSend }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [editorHTML, setEditorHTML] = useState<string>("");

  const handleChange = (
    content: string,
    delta: Delta,
    source: Sources,
    editor: UnprivilegedEditor
  ) => {
    setEditorHTML(content);
  };

  const handleSend = () => {
    if (!textareaRef.current?.value) return;

    onSend(textareaRef.current.value);
    textareaRef.current.value = "";
  };

  const modules = {
    toolbar: [
      ["bold", "italic", "strike"],
      ["link"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote"],
      ["code", "code-block"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  const formats = ["bold", "italic", "strike", "link", "list", "blockquote", "code", "code-block"];

  return (
    <Box p={2} pt={0}>
      <ReactQuill
        theme="snow"
        value={editorHTML}
        modules={modules}
        formats={formats}
        onChange={handleChange}
        bounds={"#root"}
        placeholder="Sent a message to #"
      />
      <button onClick={handleSend}>send</button>
    </Box>
  );
};

export default MessageTextArea;
