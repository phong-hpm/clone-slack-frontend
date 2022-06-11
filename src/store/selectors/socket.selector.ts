// types
import { RootState } from "store/_types";

const socketSelectors = {
  getChannelSocket: (state: RootState) => state.socket.channelSocket,
  getMessageSocket: (state: RootState) => state.socket.messageSocket,
};
export default socketSelectors;
