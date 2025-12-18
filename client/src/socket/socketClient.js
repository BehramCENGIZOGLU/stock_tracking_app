// bu dosyasının amacı Socket.IO bağlantısını tek bir yerden yönetmek
import { io } from "socket.io-client";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_BASE_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      autoConnect: false
    });
  }
  return socket;
}

export const connectSocket = (onConnect) => {
  const s = getSocket();

  if (!s.connected) {
    s.connect();
    s.once("connect", () => {
      if (onConnect) onConnect();
    });
  } else {
    if (onConnect) onConnect();
  }
};

export const joinWatchlist = (symbols) => {
  getSocket().emit("joinWatchlist", { symbols });
};

export default getSocket();
