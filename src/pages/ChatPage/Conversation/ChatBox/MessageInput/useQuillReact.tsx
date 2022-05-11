import { useContext, useEffect, useRef } from "react";

// context
import ChatBoxContext, { initialQuillState } from "./InputContext";

// types
import { ContextLinkValueType, LinkCustomEventDetailType } from "./_types";

export const useQuillReact = () => {
  const { quillReact, updateQuillState, updateAppState, setFocus } = useContext(ChatBoxContext);

  const keepRef = useRef({ ...initialQuillState, isMentioning: false });

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

  return [keepRef];
};

export default useQuillReact;
