import { useContext, useEffect, useMemo, useRef } from "react";
import * as ReactDOMServer from "react-dom/server";

// redux store
import { useSelector } from "store";

// redux selectors
import userSelectors from "store/selectors/user.selector";
import channelUsersSelectors from "store/selectors/channelUsers.selector";

// context
import InputContext, { initialQuillState } from "./InputContext";

// components
import { Box, Typography } from "@mui/material";
import UserMentionCard from "components/UserMentionCard";
import SlackIcon from "components/SlackIcon";

// types
import { UserType } from "store/slices/_types";
import { ContextLinkValueType, LinkCustomEventDetailType } from "./_types";

// utils
import { color, notifyMentions, stateDefault } from "utils/constants";
import { searchUser } from "utils/searchUser";

export interface UseQuillReactProps {
  autoFocus?: boolean;
}

// this hook will help InutMain store some logics, which are related to react-quill
export const useQuillReact = ({ autoFocus }: UseQuillReactProps) => {
  const { quillReact, updateQuillState, updateAppState, setFocus } = useContext(InputContext);

  const userId = useSelector(userSelectors.getUserId);
  const channelUserList = useSelector(channelUsersSelectors.getChannelUserList);

  // modules ref will keep the reference of modules, help QuillReact will not be broken
  const keepRef = useRef({
    ...initialQuillState,
    isMentioning: false,
    userId: "",
    userList: [] as UserType[],
  });

  const mentionModule = useMemo(() => {
    return {
      dataAttributes: [...Object.keys(stateDefault.USER), "isHighlight", "isEditable"],
      allowedChars: /^[A-Za-z\s]*$/,
      mentionDenotationChars: ["@"],
      spaceAfterInsert: true,
      defaultMenuOrientation: "top",
      onOpen: () => (keepRef.current.isMentioning = true),
      onClose: () => {
        // setTimeout will keep isMentioning is true when reactquill onKeydown is calling
        setTimeout(() => (keepRef.current.isMentioning = false), 1);
      },
      onSelect: (item: UserType, insertItem: Function) => {
        const isHighlight = !!notifyMentions[item.id] || item.id === keepRef.current.userId;
        insertItem({
          ...item,
          id: item.id,
          value: item.name,
          isHighlight,
          isEditable: true,
        });
      },
      source: (search: string, renderList: Function) => {
        let searchResult: UserType[] = [];
        if (search.length === 0) {
          searchResult = keepRef.current.userList;
        } else {
          searchResult = searchUser(keepRef.current.userList, search);
        }
        renderList([...searchResult, ...Object.values(notifyMentions)], search);
      },
      renderItem: (item: UserType) => {
        if (notifyMentions[item.id]) {
          return ReactDOMServer.renderToString(
            <Box className="mention-item" display="flex" alignItems="center" color={color.PRIMARY}>
              <Box p={0.5} mr={0.5}>
                <SlackIcon icon="broadcast" fontSize="medium" />
              </Box>
              <Box p={0.5}>
                <Typography fontWeight={700}>@{item.name}</Typography>
              </Box>
              <Box p={0.5}>
                <Typography>{item.realname}</Typography>
              </Box>
            </Box>
          );
        }

        return ReactDOMServer.renderToString(
          <UserMentionCard
            className="mention-item"
            userId={keepRef.current.userId}
            userMention={item}
          />
        );
      },
    };
  }, []);

  // after [Quill] render [modules], we can NOT update data
  // assign [userId] and [channelUserList] to keepRef will help
  //    [selectMention] and [selectMention] can access new data in runtime
  useEffect(() => {
    keepRef.current.userId = userId;
    keepRef.current.userList = [...channelUserList];
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
