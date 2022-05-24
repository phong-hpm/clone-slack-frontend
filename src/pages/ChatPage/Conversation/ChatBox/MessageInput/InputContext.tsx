import React, { FC, useRef, useCallback, createContext, useState, useMemo, useEffect } from "react";

// components
import ReactQuill from "react-quill";

// utils
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

const InputContext = createContext<InputContextType>(initialContext as unknown as InputContextType);

export interface MessageInputProviderProps {
  isEditMode?: boolean;
}

export const MessageInputProvider: FC<MessageInputProviderProps> = ({ isEditMode, children }) => {
  const keepRef = useRef<{ isFocus?: boolean; selectedIndex?: number }>({});
  const quillRef = useRef<ReactQuill | undefined>();

  const [quillState, setQuillState] = useState<ContextQuillStateType>(initialQuillState);
  const [appState, setAppState] = useState<ContextAppStateType>(initialAppState);
  const [quillReact, setQuill] = useState<ReactQuill>();

  const setQuillReact = useCallback((quill: ReactQuill) => {
    if (quillRef.current === quill) return;
    quillRef.current = quill;
    setQuill(quill);
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

  const updateInputFile = useCallback((payload: Partial<MessageFileType>) => {
    setAppState((state) => {
      const index = state.inputFiles.findIndex(({ id }) => id === payload.id);
      if (index < 0) return state;
      state.inputFiles[index] = { ...state.inputFiles[index], ...payload };
      return { ...state };
    });
  }, []);

  const removeInputFile = useCallback((payload: string) => {
    setAppState((state) => {
      const file = state.inputFiles.find((f) => f.id === payload);
      if (!file) return state;

      // revoke blob:url
      URL.revokeObjectURL(file.url);
      if (file.thumb) URL.revokeObjectURL(file.thumb);

      return { ...state, inputFiles: state.inputFiles.filter((file) => file.id !== payload) };
    });
  }, []);

  const value = useMemo(
    () => ({
      quillReact,
      setQuillReact,
      quillState,
      updateQuillState,
      appState,
      updateAppState,
      setFocus,
      setInputFile,
      updateInputFile,
      removeInputFile,
    }),
    [
      quillReact,
      quillState,
      appState,
      setQuillReact,
      updateQuillState,
      updateAppState,
      setFocus,
      setInputFile,
      updateInputFile,
      removeInputFile,
    ]
  );

  useEffect(() => updateAppState({ isEditMode }), [isEditMode, updateAppState]);

  return <InputContext.Provider value={value}>{children}</InputContext.Provider>;
};

export default InputContext;
