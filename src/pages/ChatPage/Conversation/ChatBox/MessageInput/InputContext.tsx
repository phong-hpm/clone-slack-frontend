import { FC, useRef, useCallback, createContext, useState, useMemo, useEffect } from "react";
import lodashGet from "lodash.get";

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
  configActions: {},
};

const initialContext: Partial<InputContextType> = {
  quillState: initialQuillState,
  appState: initialAppState,
};

const InputContext = createContext<InputContextType>(initialContext as unknown as InputContextType);

export interface MessageInputProviderProps extends Pick<ContextAppStateType, "configActions"> {}

// Too many api of Quill don't work in jest environment, so we can't test it
/* istanbul ignore next */
export const MessageInputProvider: FC<MessageInputProviderProps> = ({
  configActions,
  children,
}) => {
  const keepRef = useRef<{ isFocus?: boolean; selectedIndex?: number; configActions?: any }>({});
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

  // update state when [configActions] changed
  // because [configActions] is an object
  //  using deep compare to recude re-render times
  useEffect(() => {
    if (configActions) {
      setAppState((state) => {
        // check values on configActions state
        for (const [key, val] of Object.entries(configActions)) {
          // at least 1 config has diference value
          if (val !== lodashGet(state.configActions, key)) return { ...state, configActions };
        }

        // all config is not chaged
        return state;
      });
    }
  }, [configActions, updateAppState]);

  return <InputContext.Provider value={value}>{children}</InputContext.Provider>;
};

export default InputContext;
