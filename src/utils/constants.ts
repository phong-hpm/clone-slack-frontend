// types
import { UserType } from "store/slices/_types";
import { ResolutionType } from "./_types";

export const apiUrl = {
  auth: {
    checkEmail: "auth/check-email",
    confirmEmailCode: "auth/confirm-email-code",
  },
};

export const SocketEventDefault = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
};

export const SocketEvent = {
  // emit

  EMIT_LOAD_CHANNELS: "EMIT_LOAD_CHANNELS",
  EMIT_ADD_CHANNEL: "EMIT_ADD_CHANNEL",
  EMIT_ADD_USERS_TO_CHANNEL: "EMIT_ADD_USERS_TO_CHANNEL",
  EMIT_USER_LEAVE_CHANNEL: "EMIT_USER_LEAVE_CHANNEL",
  EMIT_EDIT_CHANNEL_NAME: "EMIT_EDIT_CHANNEL_NAME",
  EMIT_EDIT_CHANNEL_OPTIONAL_FIELDS: "EMIT_EDIT_CHANNEL_OPTIONAL_FIELDS",
  EMIT_CHANGE_TO_PRIVATE_CHANNEL: "EMIT_CHANGE_TO_PRIVATE_CHANNEL",

  EMIT_LOAD_MESSAGES: "EMIT_LOAD_MESSAGES",
  EMIT_LOAD_MORE_MESSAGES: "EMIT_LOAD_MORE_MESSAGES",
  EMIT_ADD_MESSAGE: "EMIT_ADD_MESSAGE",
  EMIT_SHARE_MESSAGE_TO_CHANNEL: "EMIT_SHARE_MESSAGE_TO_CHANNEL",
  EMIT_SHARE_MESSAGE_TO_GROUP_USERS: "EMIT_SHARE_MESSAGE_TO_GROUP_USERS",
  EMIT_EDIT_MESSAGE: "EMIT_EDIT_MESSAGE",
  EMIT_REMOVE_MESSAGE: "EMIT_REMOVE_MESSAGE",
  EMIT_STARRED_MESSAGE: "EMIT_STARRED_MESSAGE",
  EMIT_REACTION_MESSAGE: "EMIT_REACTION_MESSAGE",
  EMIT_REMOVE_MESSAGE_FILE: "EMIT_REMOVE_MESSAGE_FILE",

  // on
  ON_USER_ONLINE: "ON_USER_ONLINE",
  ON_USER_OFFLINE: "ON_USER_OFFLINE",

  ON_CHANNELS: "ON_CHANNELS",
  ON_ADDED_CHANNEL: "ON_ADDED_CHANNEL",
  ON_EDITED_CHANNEL: "ON_EDITED_CHANNEL",
  ON_REMOVED_CHANNEL: "ON_REMOVED_CHANNEL",
  ON_EDITED_CHANNEL_USERS: "ON_EDITED_CHANNEL_USERS",
  ON_EDITED_CHANNEL_UPDATED_TIME: "ON_EDITED_CHANNEL_UPDATED_TIME",
  ON_EDITED_CHANNEL_UNREAD_MESSAGE_COUNT: "ON_EDITED_CHANNEL_UNREAD_MESSAGE_COUNT",

  ON_MESSAGES: "ON_MESSAGES",
  ON_MORE_MESSAGES: "ON_MORE_MESSAGES",
  ON_ADDED_MESSAGE: "ON_ADDED_MESSAGE",
  ON_SHARE_MESSAGE_TO_CHANNEL: "ON_SHARE_MESSAGE_TO_CHANNEL",
  ON_EDITED_MESSAGE: "ON_EDITED_MESSAGE",
  ON_REMOVED_MESSAGE: "ON_REMOVED_MESSAGE",
  ON_REMOVED_MESSAGE_FILE: "ON_REMOVED_MESSAGE_FILE",

  ON_AUTHENTICATED: "ON_AUTHENTICATED",
  ON_ATOKEN_EXPIRED: "ON_ATOKEN_EXPIRED",
};

export const stateDefault = {
  USER: { id: "", email: "", name: "", realname: "", timeZone: "", isOnline: false } as UserType,
};

export const teamIdRegExp = new RegExp(/^T-.*$/);

export const channelIdRegExp = new RegExp(/^(C|D|G)-.*$/);

export const platformSortName = {
  MAC: "mac",
  IOS: "ios",
  WINDOW: "window",
  ANDROID: "andoird",
};

export const routePaths = {
  HOME_PAGE: "/home",
  SIGNIN_PAGE: "/signin",
  SIGNUP_PAGE: "/signup",
  CONFIRM_CODE_PAGE: "/confirm-code",
  TEAM_PAGE: "/teams",
  CHATBOX_PAGE: "/chatbox",

  DIGITAL_HQ_PAGE: "/digital-hq",
  INTERGRATIONS_PAGE: "/intergrations",
  SECURITY_PAGE: "/security",
  SLACK_CONNECT_PAGE: "/slack-connect",
  CUSTOMERS_PAGE: "/customers",
  ENTERPRICE_PAGE: "/enterprise",
  RESOURCES_PAGE: "/resouces",
  PRICING_PAGE: "/pricing",
  DOWNLOAD_PAGE: "/download",
  get DOWNLOAD_MAC_PAGE() {
    return `${this.DOWNLOAD_PAGE}/${platformSortName.MAC}`;
  },
  get DOWNLOAD_IOS_PAGE() {
    return `${this.DOWNLOAD_PAGE}/${platformSortName.IOS}`;
  },
  get DOWNLOAD_WINDOW_PAGE() {
    return `${this.DOWNLOAD_PAGE}/${platformSortName.WINDOW}`;
  },
  get DOWNLOAD_ANDROID_PAGE() {
    return `${this.DOWNLOAD_PAGE}/${platformSortName.ANDROID}`;
  },

  // footers
  SLACK_AND_EMAIL_PAGE: "/slack-and-email",
  CHANNELS_PAGE: "/channels",
  ENGAGEMENT_PAGE: "/engagement",
  SCALE_PAGE: "/scale",
  WATCH_THE_DEMO_PAGE: "/watch-the-demo",

  // footer product
  FEATURES_PAGE: "/features",
  INTEGRATIONS_PAGE: "/integrations",
  ENTERPRISE_PAGE: "/enterprise",
  SOLUTIONS_PAGE: "/solutions",

  // footer pricing
  PLANS_PAGE: "/plans",
  PAID_AND_FREE_PAGE: "/paid-and-free",

  // footer resource
  PARTNERS_PAGE: "/partners",
  DEVELOPERS_PAGE: "/developers",
  COMMUNITY_PAGE: "/community",
  APPS_PAGE: "/apps",
  BLOG_PAGE: "/blog",
  HELP_CENTER_PAGE: "/help-center",
  EVENTS_PAGE: "/events",

  // foolter company
  ABOUT_US_PAGE: "/about-us",
  LEADERSHIP_PAGE: "/leadership",
  INVESTOR_RELATIONS_PAGE: "/investor-relations",
  NEWS_PAGE: "/news",
  MEDIA_KIT_PAGE: "/media-kit",
  CAREERS_PAGE: "/careers",

  // signature navigations
  STATUS_PAGE: "/status",
  PRIVACY_PAGE: "/privacy",
  TERMS_PAGE: "/terms",
  COOKIE_PREFERENCES_PAGE: "/cookie-preferences",
  CONTACT_US_PAGE: "/contact-us",
};

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
  MAX_DARK: "rgb(29, 28, 29)",
  GRAY_SCALE: "rgb(97, 96, 97)",
  SUCCESS: "rgb(0, 122, 90)",
  DANGER: "rgb(224, 30, 90)",
  WARM: "rgb(232, 145, 45)",
  SILVER_QUICK: "rgb(163, 163, 166)",

  // specifical
  BORDER: "rgba(232, 232, 232, 0.13)",
  BORDER_ITEM: "rgba(209, 210, 211, 0.3)",
  BORDER_GRAY: "rgb(221, 221, 221)",
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
  "caret-right-unfilled",
  "caret-left-unfilled",
  "caret-up-unfilled",
  "caret-down-unfilled",
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

export enum deviceKind {
  MICROPHONE = "audioinput",
  SPEAKER = "audiooutput",
  CAMERA = "videoinput",
}
export const resolutions: ResolutionType[] = [{ width: 1280, height: 720 }];

export const notifyMentions: Record<string, UserType> = {
  "tag#here": {
    id: "tag#here",
    name: "here",
    realname: "Notify every online member in this channel",
    email: "",
    timeZone: "",
  },
  "tag#channel": {
    id: "tag#channel",
    name: "channel",
    realname: "Notify everyone in this channel",
    email: "",
    timeZone: "",
  },
};

export const eventKeys = {
  BEFORE_ALL: "BeforeAll",
  AFTER_ALL: "AfterAll",
  KEY_BACKSPACE: "8",
  KEY_TAB: "9",
  KEY_ENTER: "13",
  KEY_SHIFT: "16",
  KEY_CTRL: "17",
  KEY_ALT: "18",
  KEY_PAUSE_BREAK: "19",
  KEY_CAPS_LOCK: "20",
  KEY_ESCAPE: "27",
  KEY_SPACE: "32",
  KEY_PAGE_UP: "33",
  KEY_PAGE_DOWN: "34",
  KEY_END: "35",
  KEY_HOME: "36",
  KEY_LEFT_ARROW: "37",
  KEY_UP_ARROW: "38",
  KEY_RIGHT_ARROW: "39",
  KEY_DOWN_ARROW: "40",
  KEY_INSERT: "45",
  KEY_DELETE: "46",
  KEY_0: "48",
  KEY_1: "49",
  KEY_2: "50",
  KEY_3: "51",
  KEY_4: "52",
  KEY_5: "53",
  KEY_6: "54",
  KEY_7: "55",
  KEY_8: "56",
  KEY_9: "57",
  KEY_A: "65",
  KEY_B: "66",
  KEY_C: "67",
  KEY_D: "68",
  KEY_E: "69",
  KEY_F: "70",
  KEY_G: "71",
  KEY_H: "72",
  KEY_I: "73",
  KEY_J: "74",
  KEY_K: "75",
  KEY_L: "76",
  KEY_M: "77",
  KEY_N: "78",
  KEY_O: "79",
  KEY_P: "80",
  KEY_Q: "81",
  KEY_R: "82",
  KEY_S: "83",
  KEY_T: "84",
  KEY_U: "85",
  KEY_V: "86",
  KEY_W: "87",
  KEY_X: "88",
  KEY_Y: "89",
  KEY_Z: "90",
  KEY_LEFT_WINDOW_KEY: "91",
  KEY_RIGHT_WINDOW_KEY: "92",
  KEY_SELECT_KEY: "93",
  KEY_NUMPAD_0: "96",
  KEY_NUMPAD_1: "97",
  KEY_NUMPAD_2: "98",
  KEY_NUMPAD_3: "99",
  KEY_NUMPAD_4: "100",
  KEY_NUMPAD_5: "101",
  KEY_NUMPAD_6: "102",
  NUMPAD_7: "103",
  KEY_NUMPAD_8: "104",
  KEY_NUMPAD_9: "105",
  KEY_MULTIPLY: "106",
  KEY_ADD: "107",
  KEY_SUBTRACT: "109",
  KEY_DECIMAL_POINT: "110",
  KEY_DIVIDE: "111",
  KEY_F1: "112",
  KEY_F2: "113",
  KEY_F3: "114",
  KEY_F4: "115",
  KEY_F5: "116",
  KEY_F6: "117",
  KEY_F7: "118",
  KEY_F8: "119",
  KEY_F9: "120",
  KEY_F10: "121",
  KEY_F11: "122",
  KEY_F12: "123",
  KEY_NUM_LOCK: "144",
  KEY_SCROLL_LOCK: "145",
  KEY_SEMI_COLON: "186",
  KEY_EQUAL_SIGN: "187",
  KEY_COMMA: "188",
  KEY_DASH: "189",
  KEY_PERIOD: "190",
  KEY_FORWARD_SLASH: "191",
  KEY_GRAVE_ACCENT: "192",
  KEY_OPEN_BRACKET: "219",
  KEY_BACK_SLASH: "220",
  KEY_CLOSE_BRAKET: "221",
  KEY_SINGLE_QUOTE: "222",
};
