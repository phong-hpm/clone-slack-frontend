import React, { FC, useRef, useCallback, createContext, useState, useMemo, useEffect } from "react";

// components
import { RangeStatic } from "quill";
import ReactQuill from "react-quill";

// redux slices
import { UserType } from "../../../../../store/slices/users.slice";
import { stateDefault } from "../../../../../utils/constants";

export interface ContextQuillStateType {
  range: RangeStatic;
  blotRange: RangeStatic;
  blot: any;
}

export interface ContextAppStateType {
  isEditMode?: boolean;
  isFocus: boolean;
  isShowEditLinkModal: boolean;
  isShowLinkDetailModal: boolean;
  isShowLinkDetailPopover: boolean;
  isShowInfoModal: boolean;
  userMention: UserType;
  anchorMention?: HTMLSpanElement | null;
  anchorLink?: HTMLAnchorElement | null;
  linkValue: { text: string; href: string; url: string; isReadOnly?: boolean };
}

export interface ContextType {
  quillReact?: ReactQuill;
  setQuillReact: (quillReact: ReactQuill) => void;
  quillState: ContextQuillStateType;
  updateQuillState: (data: Partial<ContextQuillStateType>) => void;
  appState: ContextAppStateType;
  updateAppState: (data: Partial<ContextAppStateType>) => void;
  setFocus: (isFocus: boolean, index?: number) => void;
}

export const initialQuillState: ContextQuillStateType = {
  range: { index: 0, length: 0 },
  blotRange: { index: 0, length: 0 },
  blot: {},
};

const initialAppState: ContextAppStateType = {
  isFocus: true,
  isShowEditLinkModal: false,
  isShowLinkDetailModal: false,
  isShowLinkDetailPopover: false,
  isShowInfoModal: false,
  userMention: stateDefault.USER,
  linkValue: { text: "", href: "", url: "", isReadOnly: true },
};

const initialContext: Partial<ContextType> = {
  quillState: initialQuillState,
  appState: initialAppState,
};

const ChatBoxContext = createContext<ContextType>(initialContext as unknown as ContextType);

export interface MessageInputProviderProps {
  isEditMode?: boolean;
  children: React.ReactNode;
}

export const MessageInputProvider: FC<MessageInputProviderProps> = ({ isEditMode, children }) => {
  const keepRef = useRef<{ isFocus?: boolean; selectedIndex?: number }>({});
  const quillRef = useRef<ReactQuill | undefined>();

  const [quillState, setQuillState] = useState<ContextQuillStateType>(initialQuillState);
  const [appState, setAppState] = useState<ContextAppStateType>(initialAppState);

  const setQuillReact = useCallback((quill: ReactQuill) => {
    if (quillRef.current === quill) return;
    quillRef.current = quill;
  }, []);

  const updateQuillState = useCallback((payload: Partial<ContextQuillStateType>) => {
    setQuillState((state) => ({ ...state, ...payload }));
  }, []);

  const updateAppState = useCallback((payload: Partial<ContextAppStateType>) => {
    setAppState((state) => ({ ...state, ...payload }));
  }, []);

  const setFocus = useCallback(
    (focus: boolean, index?: number) => {
      // prevent calling multiple times with same params
      if (keepRef.current.isFocus === focus && keepRef.current.selectedIndex === index) return;

      if (!focus) {
        quillRef.current?.getEditor().blur();
      } else {
        quillRef.current?.getEditor().focus();
        if (index !== undefined) quillRef.current?.getEditor().setSelection(index, 0);
      }

      keepRef.current.isFocus = focus;
      keepRef.current.selectedIndex = index;
      updateAppState({ isFocus: focus });
    },
    [updateAppState]
  );

  const value = useMemo(
    () => ({
      quillReact: quillRef.current || undefined,
      setQuillReact,
      quillState,
      updateQuillState,
      appState,
      updateAppState,
      setFocus,
    }),
    [quillState, appState, setQuillReact, updateQuillState, updateAppState, setFocus]
  );

  useEffect(() => updateAppState({ isEditMode }), [isEditMode, updateAppState]);

  return <ChatBoxContext.Provider value={value}>{children}</ChatBoxContext.Provider>;
};

export default ChatBoxContext;
