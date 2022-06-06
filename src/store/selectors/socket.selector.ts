import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

const getSocketState = (state: RootState) => state.socket;

const getChannelSocket = createSelector([getSocketState], (socket) => socket.channelSocket);
const getMessageSocket = createSelector([getSocketState], (socket) => socket.messageSocket);
const socketSelectors = { getChannelSocket, getMessageSocket };

export default socketSelectors;
