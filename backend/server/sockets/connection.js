import { joinGame, startGame, setGuessForTheRound, onLeaveLobby } from "./game.js";

const connection = (io, socket) => {
  console.log({ auth: socket.handshake.auth });
  console.log(`A user has connected: ${socket.id}`);

  // console.log({ socket });
  socket.on('join', game => {

    console.log({ game });
    joinGame(io, socket, game);
  })

  socket.on('start', game => {
    console.log('game start', { game });
    startGame(io, socket, game);
  })

  socket.on('ping', msg => {
    console.log('PING', msg);
    socket.emit('pong', msg);
  })

  socket.on('submit-guess', game => setGuessForTheRound(io, socket, game))

  socket.on('leave-lobby', ({ code, username }) => {
    socket.leave(code);
    onLeaveLobby(io, socket, { code, username })
  })
}

export default connection;
