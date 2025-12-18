// bu dosyanın amacı : 
// express'in http sunucusu üzerine socket.io eklemek
// her client bağlandığında event handler'larını kurmak
// client'in "ben şu hisseleri izliyorum" demesine göre odaya dahil etmek (join) 
import { Server } from "socket.io";
import { CORS_ORIGIN } from "../config.js";

let io;

export function initSocket(httpServer) { 
io = new Server(httpServer, {
  path: "/socket.io",
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true
  }
});

  io.on("connection", (socket) => {
    console.log("SOCKET CONNECTED:", socket.id);
    socket.on("joinWatchlist", ({ symbols }) => {
      console.log("JOIN REQUEST:", symbols);
      for (const s of symbols || []) {socket.join(`stock:${s}`); console.log(`Joined room stock:${s}`);}
    });

    socket.on("leaveWatchlist", ({ symbols }) => {
      for (const s of symbols || []) socket.leave(`stock:${s}`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket not initialized");
  return io;
}