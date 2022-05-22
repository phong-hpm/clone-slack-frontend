import { createContext, FC, useCallback, useEffect, useMemo, useState } from "react";

// types
import { VideoPlayerContextType, VideoPlayerContextStateType, VideoPlayerDataType } from "./_types";

const initialState: VideoPlayerContextStateType = {
  channelName: "",
  scripts: [],
  created: 0,
  isFullScreen: false,
  isPlaying: false,
  isCaption: false,
  isShowThreadScriptBar: false,

  // video states
  src: "",
  duration: 0,
  currentTime: 0,
  volume: 1,
  speed: "1",
};

const initialContext: VideoPlayerContextType = {
  state: initialState,
  updateState: () => {},
};

export const VideoPlayerContext = createContext<VideoPlayerContextType>(initialContext);

export interface VideoPlayerContextProviderProps {
  children: React.ReactNode;
  dataProps: Partial<VideoPlayerDataType>;
}

export const VideoPlayerContextProvider: FC<VideoPlayerContextProviderProps> = ({
  dataProps,
  children,
}) => {
  const [state, setState] = useState<VideoPlayerContextStateType>(initialState);

  const updateState = useCallback((payload: Partial<VideoPlayerContextStateType>) => {
    setState((state) => ({ ...state, ...payload }));
  }, []);

  const value = useMemo(() => ({ state, updateState }), [state, updateState]);

  useEffect(() => {
    setState((oldState) => ({ ...oldState, ...dataProps }));
  }, [dataProps]);

  return <VideoPlayerContext.Provider value={value}>{children}</VideoPlayerContext.Provider>;
};
