import React, { FC, useRef, useCallback, createContext, useState, useMemo, useEffect } from "react";

// components
import ReactQuill from "react-quill";

// redux slices
import { stateDefault } from "utils/constants";

// types
import { MessageFileType } from "store/slices/_types";
import { ContextAppStateType, ContextQuillStateType, InputContextType } from "./_types";

export const initialQuillState: ContextQuillStateType = {
  range: { index: 0, length: 0 },
  blotRange: { index: 0, length: 0 },
  blot: {},
};

const initialAppState: ContextAppStateType = {
  isFocus: true,
  userMention: stateDefault.USER,
  inputFiles: [],
};

const initialContext: Partial<InputContextType> = {
  quillState: initialQuillState,
  appState: initialAppState,
};

const ChatBoxContext = createContext<InputContextType>(
  initialContext as unknown as InputContextType
);

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

  const setInputFile = useCallback((payload: MessageFileType) => {
    setAppState((state) => ({ ...state, inputFiles: [...state.inputFiles, payload] }));
  }, []);

  const removeInputFile = useCallback((payload: string) => {
    setAppState((state) => ({
      ...state,
      inputFiles: state.inputFiles.filter((file) => file.id !== payload),
    }));
  }, []);

  const value = useMemo(
    () => ({
      quillReact: quillRef.current || undefined,
      setQuillReact,
      quillState,
      updateQuillState,
      appState,
      updateAppState,
      setFocus,
      setInputFile,
      removeInputFile,
    }),
    [
      quillState,
      appState,
      setQuillReact,
      updateQuillState,
      updateAppState,
      setFocus,
      setInputFile,
      removeInputFile,
    ]
  );

  useEffect(() => updateAppState({ isEditMode }), [isEditMode, updateAppState]);

  return <ChatBoxContext.Provider value={value}>{children}</ChatBoxContext.Provider>;
};

export default ChatBoxContext;
