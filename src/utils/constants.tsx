// types
import { UserType } from "store/slices/_types";

export const SocketEventDefault = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
};

export const SocketEvent = {
  // emit
  EMIT_LOAD_CHANNELS: "EMIT_LOAD_CHANNELS",
  EMIT_ADD_CHANNEL: "EMIT_ADD_CHANNEL",
  ON_USER_ONLINE: "ON_USER_ONLINE",
  ON_USER_OFFLINE: "ON_USER_OFFLINE",

  EMIT_LOAD_MESSAGES: "EMIT_LOAD_MESSAGES",
  EMIT_ADD_MESSAGE: "EMIT_ADD_MESSAGE",
  EMIT_EDIT_MESSAGE: "EMIT_EDIT_MESSAGE",
  EMIT_REMOVE_MESSAGE: "EMIT_REMOVE_MESSAGE",

  // on
  ON_CHANNELS: "ON_CHANNELS",
  ON_ADDED_CHANNEL: "ON_ADDED_CHANNEL",

  ON_MESSAGES: "ON_MESSAGES",
  ON_ADDED_MESSAGE: "ON_ADDED_MESSAGE",
  ON_EDITED_MESSAGE: "ON_EDITED_MESSAGE",
  ON_REMOVED_MESSAGE: "ON_REMOVED_MESSAGE",
  EMIT_STAR_MESSAGE: "EMIT_STAR_MESSAGE",
  EMIT_REACTION_MESSAGE: "EMIT_REACTION_MESSAGE",

  ON_AUTHENTICATED: "ON_AUTHENTICATED",
  ON_ATOKEN_EXPIRED: "ON_ATOKEN_EXPIRED",
};

export const stateDefault = {
  USER: { id: "", email: "", name: "", realname: "", timeZone: "", isOnline: false } as UserType,
};

export const teamIdRegExp = new RegExp(
  /^T-[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}$/
);

export const channelIdRegExp = new RegExp(
  /^(C|D)-[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}$/
);

export enum RouterPath {
  HOME_PAGE = "/",
  LOGIN_PAGE = "/login",
  TEAM_PAGE = "/teams-page",
}

export const rgba = (rgb: string, alpha: number) => {
  const str = rgb.replace("rgb(", "").replace(")", "");
  return `rgba(${str}, ${alpha})`;
};

export const color = {
  // main
  PRIMARY: "rgb(209, 210, 211)", // #D1D2D3
  PRIMARY_BACKGROUND: "rgb(26, 29, 33)", // #1A1D21
  INVERTED: "rgb(26, 29, 33)",
  INVERTED_BACKGROUND: "rgb(209, 210, 211)",
  MAX: "rgb(232, 232, 232)",
  HIGH: "rgba(232, 232, 232, 0.7)",
  MID: "rgb(232, 232, 232)",
  LOW: "rgb(232, 232, 232)",
  SOFT: "rgb(232, 232, 232)",
  MIN: "rgb(232, 232, 232)",
  MAX_SOLID: "rgb(171, 171, 173)", // #ABABAD
  HIGH_SOLID: "rgb(129, 131, 133)", // #818385
  MID_SOLID: "rgb(81, 84, 87)",
  LOW_SOLID: "rgb(53, 55, 59)",
  SOFT_SOLID: "rgb(36, 39, 42)",
  MIN_SOLID: "rgb(34, 37, 41)",
  HIGHLIGHT: "rgb(29, 155, 209)",
  HIGHLIGHT_HOVER: "rgb(64, 179, 228)",

  // extra
  LIGHT: "rgb(255, 255, 255)",
  DARK: "rgb(0, 0, 0)",
  SUCCESS: "rgb(0, 122, 90)",
  DANGER: "rgb(224, 30, 90)",
  SILVER_QUICK: "rgb(163, 163, 166)",

  // specifical
  BORDER: "rgba(232, 232, 232, 0.13)",
  BORDER_ITEM: "rgba(209, 210, 211, 0.3)",
  SELECTED_ITEM: "rgb(18, 100, 163)",
  HOVER_ITEM: "rgb(17, 100, 163)",
  BG_WORK_SPACE: "rgb(25, 23, 29)",
};

export const css = {
  BOX_SHADOW: `0 0 0 1px ${color.BORDER}, 0 5px 10px rgba(0,0,0,.12)`,
  BOX_SHADOW_ITEM: `${color.HIGHLIGHT} 0px 0px 0px 1px, ${rgba(
    color.HIGHLIGHT,
    0.3
  )} 0px 0px 0px 5px`,
};

export const iconName = [
  "caret-right",
  "caret-down",
  "plus",
  "plus-small",
  "channel-pane-hash",
  "mentions",
  "more-vert",
  "buildings",
  "mentions",
  "hash-medium-bold",
  "chevron-down",
  "lock",
  "channel",
  "form-checkbox-check",
  "presence-online",
  "presence-offline",
];

export const iconImgName = [
  "ellipsis-vertical-filled",
  "close",
  "close-small",
  "compose",
  "clock",
  "help",
  "bold",
  "italic",
  "strikethrough",
  "link",
  "numbered-list",
  "bulleted-list",
  "quote",
  "code",
  "code-block",
  "video",
  "microphone",
  "emoji",
  "formatting",
  "send-filled",
  "check-circle",
];

export const quillFormats = [
  "bold",
  "italic",
  "strike",
  "link",
  "list",
  "blockquote",
  "code",
  "code-block",
  "mention",
];
