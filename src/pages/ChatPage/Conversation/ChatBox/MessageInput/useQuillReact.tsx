import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as ReactDOMServer from "react-dom/server";

// redux store
import { useSelector } from "store";

// redux selectors
import * as authSelectors from "store/selectors/auth.selector";
import * as usersSelectors from "store/selectors/users.selector";

// context
import ChatBoxContext, { initialQuillState } from "./InputContext";

// components
import MentionItem from "./MentionItem";

// types
import { StringMap } from "quill";
import { UserType } from "store/slices/_types";
import { ContextLinkValueType, LinkCustomEventDetailType } from "./_types";

// utils
import { stateDefault } from "utils/constants";
import { searchUserMention } from "utils/quillUtils";

export interface UseQuillReactProps {
  autoFocus?: boolean;
}

// this hook will help InutMain store some logics, which are related to react-quill
export const useQuillReact = ({ autoFocus }: UseQuillReactProps) => {
  const { quillReact, updateQuillState, updateAppState, setFocus } = useContext(ChatBoxContext);

  const user = useSelector(authSelectors.getUser);
  const userList = useSelector(usersSelectors.getUserList);

  // modules ref will keep the reference of modules, help QuillReact will not be broken
  const modulesRef = useRef<StringMap>({});
  const keepRef = useRef({ ...initialQuillState, isMentioning: false });

  const [toolbarEL, setToolbarEL] = useState<HTMLDivElement | null>(null);

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

  // modulesRef.current will keep reference of module
  //   will help QuillReact re-render correctly
  const modules = useMemo(() => {
    modulesRef.current.toolbar = toolbarEL ? { container: toolbarEL } : false;
    modulesRef.current.mention = mentionModule;
    modulesRef.current.clipboard = { matchVisual: false };
    // remove handler of enter key
    modulesRef.current.keyboard = { bindings: { enter: { key: 13, handler: () => {} } } };

    return modulesRef.current;
  }, [toolbarEL, mentionModule]);

  // listen event click link
  useEffect(() => {
    const linkClick = (event: any) => {
      const node = event.node as HTMLAnchorElement;
      const linkValue = event.value as ContextLinkValueType;
      const isFocus = quillReact?.getEditor()?.hasFocus();

      if (isFocus && !linkValue.isReadOnly) {
        const detail: LinkCustomEventDetailType = {
          ...keepRef.current,
          anchorEl: node,
          linkValue,
          quillReact,
          setFocus,
        };
        window.dispatchEvent(new CustomEvent("open-link-detail-modal", { detail }));
      }
    };

    window.addEventListener("link-clicked", linkClick);
    return () => window.removeEventListener("link-clicked", linkClick);
  }, [quillReact, updateAppState, updateQuillState, setFocus]);

  // remove quill tooltip
  useEffect(() => {
    const qlTooltip = document.querySelector(".ql-tooltip");
    if (qlTooltip) qlTooltip.remove();
  }, []);

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

  return { keepRef, modules, toolbarEL, setToolbarEL };
};

export default useQuillReact;
