import { joinGame, startGame, setGuessForTheRound, onLeaveLobby } from "./game.js";

const connection = (io, socket) => {
  console.log(`A user has connected: ${socket.id}`);

  socket.on('join', game => {
    joinGame(io, socket, game);
  })

  socket.on('start', game => {
    startGame(io, socket, game);
  })

  socket.on('ping', msg => {
    socket.emit('pong', msg);
  })

  socket.on('submit-guess', game => setGuessForTheRound(io, socket, game))

  socket.on('leave-lobby', ({ code, username }) => {
    socket.leave(code);
    onLeaveLobby(io, socket, { code, username })
  })
}

export default connection;
