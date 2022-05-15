import { useState, useCallback, useContext, FC } from "react";

// components
import "quill-mention";
import { Box } from "@mui/material";
import ReactQuill from "react-quill";
import InputActions from "./InputActions";
import InputToolbar from "./InputToolbar";
import QuillFormatLink from "../MessageLink/QuillFormatLink";
import ReviewFileList from "./Review/ReviewFileList";

// context
import InputContext from "./InputContext";

// utils
import { color } from "utils/constants";
import { quillFormats } from "utils/constants";
import { removeUnnecessaryFields } from "utils/message";

// hook
import useQuillReact from "./useQuillReact";

// types
import { Delta, RangeStatic } from "quill";
import { LinkCustomEventDetailType } from "./_types";
import { MessageFileType } from "store/slices/_types";

export interface InputMainProps {
  autoFocus?: boolean;
  defaultValue?: Delta;
  placeHolder?: string;
  onCancel?: () => void;
  onSend: (delta: Delta, files: MessageFileType[]) => void;
}

const InputMain: FC<InputMainProps> = ({
  autoFocus = false,
  placeHolder,
  defaultValue,
  onCancel,
  onSend,
}) => {
  const { appState, quillReact, updateQuillState, updateAppState, setQuillReact, setFocus } =
    useContext(InputContext);

  const { keepRef, modules, toolbarEL, setToolbarEL } = useQuillReact({ autoFocus });

  const [isDisabled, setDisabled] = useState(true);
  const [isShowToolbar, setShowToolbar] = useState(true);

  const handleSend = useCallback(() => {
    const textLength = quillReact?.getEditor().getText()?.trim()?.length;
    const inputDelta = quillReact?.getEditor()?.getContents();

    if (inputDelta) {
      const delta = textLength ? removeUnnecessaryFields(inputDelta) : ({} as Delta);
      onSend(delta, appState.inputFiles);

      quillReact?.getEditor()?.setContents({ ops: [{ insert: "\n" }] } as Delta);
      updateAppState({ inputFiles: [] });
    }
  }, [appState.inputFiles, quillReact, onSend, updateAppState]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      // if user are holding shift, add new line
      // if user barely mentioned a user, add new user mention
      if (!event.shiftKey && !keepRef.current.isMentioning) handleSend();
    }
  };

  const handleChange = (text: string) => {
    setDisabled(!text.length || text === "<p><br></p>");
  };

  const handleChangeSelection = (range: RangeStatic) => {
    if (!quillReact?.getEditor() || !range) return;
    const [blot, offset] = (quillReact?.getEditor().scroll as any).descendant(
      QuillFormatLink,
      range.index
    );

    const blotRange = { index: range.index - (offset || 0), length: blot ? blot.length() : 0 };
    let linkData = { content: "", href: "" };

    // repare link data
    if (blot && blot.domNode) {
      const domNode = blot.domNode as HTMLAnchorElement;
      linkData = { content: domNode.textContent || "", href: domNode.getAttribute("href") || "" };
    } else {
      if (range.length) {
        // if selected text is not a Blot, use it as link content
        linkData.content = quillReact?.getEditor().getText(range.index, range.length);
      }
    }

    keepRef.current.blot = blot;
    keepRef.current.range = range;
    keepRef.current.blotRange = blotRange;
  };

  const handleClickLinkToolbar = () => {
    const { blot, range, blotRange } = keepRef.current;
    const text = quillReact?.getEditor().getText(range.index, range.length) || "";
    const linkValue = { text, href: "", url: "" };

    updateQuillState({ blot, range, blotRange });

    const detail: LinkCustomEventDetailType = { quillReact, linkValue, range, blotRange, setFocus };
    window.dispatchEvent(new CustomEvent("open-link-edit-modal", { detail }));

    // blur quill to help EditLink input can auto focus
    quillReact?.getEditor().blur();
  };

  const handleClickAtSign = () => {
    if (!appState.isFocus) return;

    let curIndex = quillReact?.getEditor().getSelection()?.index;
    const charactorBeforeCursor = curIndex ? quillReact?.getEditor().getText(curIndex - 1, 1) : "";

    // insert "@" if charactor before cursor is not a "@"
    if (charactorBeforeCursor !== "@") {
      quillReact?.getEditor().insertText(curIndex || 0, "@");
    }

    curIndex = quillReact?.getEditor().getSelection()?.index;
    if (curIndex) {
      // First: set selection before "@"
      // Next: set selection after "@"
      // these 2 step will trigger open mention tooltip
      quillReact?.getEditor().setSelection(curIndex - 1, 0);
      quillReact?.getEditor().setSelection(curIndex, 0);
    }
  };

  const handleAddEmoji = (emojiNative: string) => {
    let curIndex = keepRef.current.range.index;
    quillReact?.getEditor().insertText(curIndex || 0, emojiNative);
  };

  return (
    <Box color={color.PRIMARY}>
      <Box
        position="relative"
        borderRadius={appState.isEditMode ? 1 : 2}
        border="1px solid"
        borderColor={appState.isFocus ? color.HIGH_SOLID : color.MID_SOLID}
        bgcolor={color.MIN_SOLID}
      >
        <Box display={isShowToolbar ? "block" : "none"}>
          <InputToolbar
            ref={(ref) => setToolbarEL(ref)}
            isFocus={appState.isFocus}
            onClickLink={handleClickLinkToolbar}
          />
        </Box>

        {/* wait for toolbar rendered */}
        {toolbarEL && (
          <ReactQuill
            ref={setQuillReact}
            className="quill-editor"
            modules={modules}
            formats={quillFormats}
            placeholder={placeHolder}
            defaultValue={defaultValue}
            onKeyDown={handleKeyDown}
            onChangeSelection={handleChangeSelection}
            onChange={handleChange}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
        )}

        <ReviewFileList />

        <InputActions
          isShowToolbar={isShowToolbar}
          isDisabledSend={isDisabled}
          onSelectEmoji={handleAddEmoji}
          onClickAtSign={handleClickAtSign}
          onToggleToolbar={(isShow) => setShowToolbar(isShow)}
          onCancel={onCancel}
          onSend={handleSend}
        />
      </Box>
    </Box>
  );
};

export default InputMain;
