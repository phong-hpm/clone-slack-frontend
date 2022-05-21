import { VideoInstance } from "components/Video/_types";
import { UserType } from "store/slices/_types";

// Transcript.tsx  -----------------
export interface TranScriptType {
  currentTime: number;
  label: string;
}

// VideoPlayerContext.tsx  -----------------
export interface VideoPlayerDataType {
  channelName: string;
  src: string;
  created: number;
  duration: number;
  scripts: TranScriptType[];
  thumbnail?: string;
  userOwner?: UserType;
}

export interface VideoPlayerContextStateType extends VideoPlayerDataType {
  isFullScreen: boolean;
  currentTime: number;
  volume: number;
  speed: string;
  isHover: boolean;
  isPlaying: boolean;
  isCaption: boolean;
  isShowThreadScriptBar: boolean;
}

export interface VideoPlayerContextType {
  state: VideoPlayerContextStateType;
  updateState: (payload: Partial<VideoPlayerContextStateType>) => void;
}

// PlayerBase.tsx  -----------------

export interface PlayerBaseInstance {
  video: VideoInstance;
  containerEl?: HTMLDivElement | null;
}
