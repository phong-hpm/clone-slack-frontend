import { Socket } from "socket.io-client";

// ChannelSocketContext.tsx -----------------
export interface ChannelContextType {
  socket?: Socket;
  isConnected: boolean;
  updateNamespace: (name: string) => void;
}

// MessageSocketContext.tsx -----------------
export interface MessageContextType {
  socket?: Socket;
  isConnected: boolean;
  updateNamespace: (name: string) => void;
}
