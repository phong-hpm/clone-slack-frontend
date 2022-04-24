export const SocketEventDefault = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
};

export const SocketEvent = {
  // emit
  EMIT_LOAD_CHANELS: "EMIT_LOAD_CHANELS",
  EMIT_ADD_CHANEL: "EMIT_ADD_CHANEL",

  EMIT_LOAD_MESSAGES: "EMIT_LOAD_MESSAGES",
  EMIT_ADD_MESSAGE: "EMIT_ADD_MESSAGE",

  // on
  ON_CHANELS: "ON_CHANELS",
  ON_NEW_CHANEL: "ON_NEW_CHANEL",

  ON_MESSAGES: "ON_MESSAGES",
  ON_NEW_MESSAGE: "ON_NEW_MESSAGE",

  ON_AUTHENTICATED: "ON_AUTHENTICATED",
  ON_ATOKEN_EXPIRED: "ON_ATOKEN_EXPIRED",
};

export const teamIdRegExp = new RegExp(
  /^T-[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}$/
);

export enum RouterPath {
  HOME_PAGE = "/",
  LOGIN_PAGE = "/login",
  TEAM_PAGE = "/teams-page",
}
