import { Socket } from "socket.io-client";

// ChannelSocketContext.tsx -----------------
export interface ChannelContextType {
  socket?: Socket;
  updateNamespace: (name: string) => void;
}

// MessageSocketContext.tsx -----------------
export interface MessageContextType {
  socket?: Socket;
  updateNamespace: (name: string) => void;
}
