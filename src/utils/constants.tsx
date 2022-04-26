export const SocketEventDefault = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
};

export const SocketEvent = {
  // emit
  EMIT_LOAD_CHANNELS: "EMIT_LOAD_CHANNELS",
  EMIT_ADD_CHANNEL: "EMIT_ADD_CHANNEL",

  EMIT_LOAD_MESSAGES: "EMIT_LOAD_MESSAGES",
  EMIT_ADD_MESSAGE: "EMIT_ADD_MESSAGE",

  // on
  ON_CHANNELS: "ON_CHANNELS",
  ON_NEW_CHANNEL: "ON_NEW_CHANNEL",

  ON_MESSAGES: "ON_MESSAGES",
  ON_NEW_MESSAGE: "ON_NEW_MESSAGE",

  ON_AUTHENTICATED: "ON_AUTHENTICATED",
  ON_ATOKEN_EXPIRED: "ON_ATOKEN_EXPIRED",
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
