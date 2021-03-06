import { useState, useContext, FC, useEffect, useRef, useMemo } from "react";

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
import { StringMap, Delta, RangeStatic, Sources } from "quill";
import { LinkCustomEventDetailType } from "./_types";
import { MessageFileType } from "store/slices/_types";

export interface InputMainProps {
  className?: string;
  autoFocus?: boolean;
  defaultValue?: Delta;
  placeHolder?: string;
  style?: React.CSSProperties;
  onCancel?: () => void;
  onBlur?: (delta: Delta) => void;
  onSend?: (delta: Delta, files: MessageFileType[]) => void;
}

// Too many api of Quill don't work in jest environment, so we can't test it
/* istanbul ignore next */
const InputMain: FC<InputMainProps> = ({
  className,
  autoFocus = false,
  placeHolder,
  style,
  defaultValue,
  onCancel,
  onBlur,
  onSend,
}) => {
  const { appState, quillReact, updateQuillState, updateAppState, setQuillReact, setFocus } =
    useContext(InputContext);

  const { keepRef, mentionModule } = useQuillReact({ autoFocus });

  const modulesRef = useRef<StringMap>({});
  const toolbarRef = useRef<HTMLDivElement>(null);

  const [isMounted, setMounted] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [isShowToolbar, setShowToolbar] = useState(true);

  // modulesRef.current will keep reference of module
  //   will help QuillReact re-render correctly
  const modules = useMemo(() => {
    modulesRef.current.toolbar = isMounted ? { container: toolbarRef.current } : false;
    modulesRef.current.mention = mentionModule;
    modulesRef.current.clipboard = { matchVisual: false };
    // remove handler of enter key
    modulesRef.current.keyboard = { bindings: { enter: { key: 13, handler: () => {} } } };

    return modulesRef.current;
  }, [isMounted, mentionModule]);

  const handleSend = () => {
    // when [onSend] is undefined, that mean this [MainInput] is being used for typing only
    if (!onSend) return;

    const textLength = quillReact?.getEditor().getText()?.trim()?.length;
    const inputDelta = quillReact?.getEditor()?.getContents();
    let isValidText = !!textLength;

    // when editor only contain mention tag, textLength will be 0
    // so if the first [delta.ops] is mention, it is valid text
    if (!isValidText && inputDelta?.ops?.length) {
      isValidText = !!inputDelta.ops[0].insert.mention;
    }

    if (appState.inputFiles.length || inputDelta) {
      let uploadDelta =
        isValidText && inputDelta ? removeUnnecessaryFields(inputDelta) : ({} as Delta);
      onSend(uploadDelta, appState.inputFiles);
    }

    quillReact?.getEditor()?.setContents({ ops: [{ insert: "\n" }] } as Delta);
    updateAppState({ inputFiles: [] });
  };

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

  const handleBlur = (_: RangeStatic, source: Sources) => {
    // when user paste from clipboard, source will be "silent"
    if (source === "silent") return;
    setFocus(false);
  };

  const handleBlurOutside = () => {
    if (onBlur) {
      const textLength = quillReact?.getEditor().getText()?.trim()?.length;
      const inputDelta = quillReact?.getEditor()?.getContents();
      if (textLength && inputDelta) {
        onBlur(inputDelta);
      }
    }
  };

  useEffect(() => {
    if (!placeHolder || !quillReact) return;
    quillReact.getEditor().root.dataset.placeholder = placeHolder;
  }, [placeHolder, quillReact]);

  useEffect(() => setMounted(true), []);

  return (
    <Box color={color.PRIMARY}>
      <Box
        position="relative"
        // if [configActions] has schedule => is main message input -> radius = 2
        borderRadius={appState.configActions.schedule ? 2 : 1}
        border="1px solid"
        borderColor={appState.isFocus ? color.HIGH_SOLID : color.MID_SOLID}
        bgcolor={color.MIN_SOLID}
        onBlur={handleBlurOutside}
      >
        <Box display={isShowToolbar ? "block" : "none"}>
          <InputToolbar
            ref={toolbarRef}
            isFocus={appState.isFocus}
            onClickLink={handleClickLinkToolbar}
          />
        </Box>

        {/* wait for toolbar rendered */}
        {isMounted && (
          <ReactQuill
            ref={setQuillReact}
            className={`quill-editor ${className}`}
            modules={modules}
            formats={quillFormats}
            style={style}
            defaultValue={defaultValue}
            onKeyDown={handleKeyDown}
            onChangeSelection={handleChangeSelection}
            onChange={handleChange}
            onFocus={() => setFocus(true)}
            onBlur={handleBlur}
          />
        )}

        <ReviewFileList />

        <InputActions
          isShowToolbar={isShowToolbar}
          isDisabledSend={isDisabled && !appState.inputFiles.length}
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
