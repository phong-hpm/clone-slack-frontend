import { useContext, useEffect, useMemo, useRef } from "react";
import * as ReactDOMServer from "react-dom/server";

// redux store
import { useSelector } from "store";

// redux selectors
import * as authSelectors from "store/selectors/auth.selector";
import * as usersSelectors from "store/selectors/channelUsers.selector";

// context
import InputContext, { initialQuillState } from "./InputContext";

// components
import MentionItem from "./InputMentionItem";

// types
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
  const { quillReact, updateQuillState, updateAppState, setFocus } = useContext(InputContext);

  const userId = useSelector(authSelectors.getUserId);
  const channelUserList = useSelector(usersSelectors.getChannelUserList);

  // modules ref will keep the reference of modules, help QuillReact will not be broken
  const keepRef = useRef({
    ...initialQuillState,
    isMentioning: false,
    userId: "",
    channelUserList: [] as UserType[],
  });

  const mentionModule = useMemo(() => {
    return {
      dataAttributes: [...Object.keys(stateDefault.USER), "isOwner", "isEditable"],
      allowedChars: /^[A-Za-z\s]*$/,
      mentionDenotationChars: ["@"],
      spaceAfterInsert: true,
      defaultMenuOrientation: "top",
      onOpen: () => (keepRef.current.isMentioning = true),
      onClose: () => {
        // setTimeout will keep isMentioning is true when reactquill onKeydown is calling
        setTimeout(() => (keepRef.current.isMentioning = false), 1);
      },
      onSelect: (userMention: UserType, insertItem: Function) => {
        insertItem({
          ...userMention,
          id: userMention.id,
          value: userMention.name,
          isOwner: userMention.id === keepRef.current.userId,
          isEditable: true,
        });
      },
      source: (search: string, renderList: Function) => {
        const { channelUserList = [] } = keepRef.current;
        if (search.length === 0) return renderList(channelUserList, search);
        renderList(searchUserMention(channelUserList, search), search);
      },
      renderItem: (userMention: UserType) => {
        return ReactDOMServer.renderToString(
          <MentionItem userId={keepRef.current.userId} userMention={userMention} />
        );
      },
    };
  }, []);

  // after [Quill] render [modules], we can NOT update data
  // assign [userId] and [channelUserList] to keepRef will help
  //    [selectMention] and [selectMention] can access new data in runtime
  useEffect(() => {
    keepRef.current.userId = userId;
    keepRef.current.channelUserList = channelUserList;
  }, [userId, channelUserList]);

  // listen event click link
  useEffect(() => {
    const linkClick = (event: any) => {
      const node = event.node as HTMLAnchorElement;
      const linkValue = event.value as ContextLinkValueType;
      const isFocus = quillReact?.getEditor()?.hasFocus();

      if (isFocus && linkValue.isEditable) {
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
    const timeoutId = setTimeout(() => {
      setFocus(true, quillReact?.getEditor()?.scroll.length());
    }, 1);

    return () => clearTimeout(timeoutId);
  }, [autoFocus, quillReact, setFocus]);

  return { keepRef, mentionModule };
};

export default useQuillReact;
