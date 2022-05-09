import { useState, useEffect, useMemo, useCallback, useContext, FC } from "react";
import * as ReactDOMServer from "react-dom/server";

// redux store
import { useSelector } from "store";

// redux selectors
import * as authSelectors from "store/selectors/auth.selector";
import * as usersSelectors from "store/selectors/users.selector";

// redux slices
import { UserType } from "store/slices/users.slice";

// components
import "quill-mention";
import { Delta, RangeStatic } from "quill";
import { Box } from "@mui/material";
import ReactQuill from "react-quill";
import InputActions from "./InputActions";
import InputToolbar from "./InputToolbar";
import QuillFormatLink from "./QuillFormatLink";
import MentionItem from "./MentionItem";

// context
import ChatBoxContext from "./InputContext";

// utils
import { color } from "utils/constants";
import { quillFormats, stateDefault } from "utils/constants";
import { searchUserMention } from "utils/quillUtils";
import { removeUnnecessaryFields } from "utils/message";

// hook
import useQuillReact, { LinkCustomEventDetailType } from "./useQuillReact";

export interface InputMainProps {
  autoFocus?: boolean;
  defaultValue?: Delta;
  placeHolder?: string;
  onCancel?: () => void;
  onSend?: (delta: Delta) => void;
}

const InputMain: FC<InputMainProps> = ({
  autoFocus = false,
  placeHolder,
  defaultValue,
  onCancel,
  onSend,
}) => {
  const { appState, quillReact, updateQuillState, setQuillReact, updateAppState, setFocus } =
    useContext(ChatBoxContext);

  const user = useSelector(authSelectors.getUser);
  const userList = useSelector(usersSelectors.getUserList);

  const [keepRef] = useQuillReact();

  const [toolbarEL, setToolbarEL] = useState<HTMLDivElement | null>(null);
  const [isDisabled, setDisabled] = useState(true);
  const [isShowToolbar, setShowToolbar] = useState(true);

  const mentionSource = useCallback(
    (search: string, renderList: Function) => {
      if (search.length === 0) return renderList(userList, search);
      renderList(searchUserMention(userList, search), search);
    },
    [userList]
  );

  const selectMention = useCallback(
    (userMention: UserType, insertItem: Function) => {
      insertItem({
        ...userMention,
        id: userMention.id,
        value: userMention.name,
        isOwner: userMention.id === user.id,
        isClickable: false,
      });
    },
    [user.id]
  );

  const renderUserMentionItem = useCallback(
    (userMention: UserType) =>
      ReactDOMServer.renderToString(<MentionItem userId={user.id} userMention={userMention} />),
    [user.id]
  );

  const mentionModule = useMemo(() => {
    return {
      dataAttributes: [...Object.keys(stateDefault.USER), "isOwner", "isReadOnly"],
      allowedChars: /^[A-Za-z\s]*$/,
      mentionDenotationChars: ["@"],
      spaceAfterInsert: true,
      defaultMenuOrientation: "top",
      source: mentionSource,
      renderItem: renderUserMentionItem,
      onOpen: () => (keepRef.current.isMentioning = true),
      onClose: () => {
        // setTimeout will keep isMentioning is true when reactquill onKeydown is calling
        setTimeout(() => (keepRef.current.isMentioning = false), 1);
      },
      onSelect: selectMention,
    };
  }, [keepRef, selectMention, mentionSource, renderUserMentionItem]);

  const modules = useMemo(() => {
    const result = {
      toolbar: toolbarEL ? { container: toolbarEL } : false,
      clipboard: { matchVisual: false },
      // remove handler of enter key
      keyboard: { bindings: { enter: { key: 13, handler: () => {} } } },
      mention: mentionModule,
    };

    return result;
  }, [toolbarEL, mentionModule]);

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

    updateAppState({ isShowEditLinkModal: true, linkValue });

    const detail: LinkCustomEventDetailType = { quillReact, linkValue, range, blotRange, setFocus };
    window.dispatchEvent(new CustomEvent("open-link-edit-modal", { detail }));

    // blur quill to help EditLink input can auto focus
    quillReact?.getEditor().blur();
  };

  const handleSend = useCallback(() => {
    const delta = quillReact?.getEditor()?.getContents();
    delta && onSend && onSend(removeUnnecessaryFields(delta));
    quillReact?.getEditor()?.setContents({ ops: [{ insert: "\n" }] } as Delta);
  }, [quillReact, onSend]);

  // blur quill after render
  useEffect(() => setFocus(false), [setFocus]);

  // by default, react-quill will be focused after render
  // set autofocus after quill blured
  useEffect(() => {
    if (!autoFocus) return;

    // using setTimeout to wait for quill-react finish rendering
    setTimeout(() => {
      setFocus(true, quillReact?.getEditor()?.scroll.length());
    }, 1);
  }, [autoFocus, quillReact, setFocus]);

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

        <InputActions
          isShowToolbar={isShowToolbar}
          isDisabledSend={isDisabled}
          onToggleToolbar={(isShow) => setShowToolbar(isShow)}
          onCancel={onCancel}
          onSend={handleSend}
        />
      </Box>
    </Box>
  );
};

export default InputMain;
