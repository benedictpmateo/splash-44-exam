import { joinGame, leaveGame } from "./game.js";

const disconnect = (io, socket) => {
  socket.on('disconnect', () => {
    leaveGame(io, socket);
  })
}

export default disconnect;
