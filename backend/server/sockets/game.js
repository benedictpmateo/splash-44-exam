import { GameModel } from "../database/models/game.js";
import { UserModel } from "../database/models/user.js";

const DEDUCTION = 10; //credits

const generateSecretNumber = () => {
  const min = 0;
  const max = 9.99;
  const number = Number(Math.random() * (max - min) + min).toFixed(2);
  return Number(number);
};

/**
 * Join Game
 * @description Executes when host and other players joins the game
 * @param {*} io
 * @param {*} socket
 * @param {*} game
 * @returns
 */
export const joinGame = async (io, socket, { user, code, isHost, rounds }) => {
  const { username, credits } = user;
  const game = await GameModel.findOne({ code });

  if (!game) {
    if (!isHost) {
      socket.emit("error", "This game is over");
      return;
    }
    socket.join(code);
    const players = [{ username, isHost, credits }];
    await GameModel.create({
      code,
      players,
      rounds,
      isStarted: false,
    });
    io.in(code).emit("joined-lobby", { code, rounds, players });
    return;
  }
  if (game) {
    if (game.isStarted) {
      socket.emit("error", "This game is already started");
      return;
    }
    if (game.players.length < 5) {
      socket.join(code);
      await GameModel.updateOne(
        { code },
        {
          $push: {
            players: {
              username,
              credits,
            },
          },
        }
      );
      await game.save();
      io.in(code).emit("joined-lobby", {
        code,
        rounds: game.rounds,
        players: [
          ...game.players,
          {
            username,
            credits,
          },
        ],
      });

      socket.emit("message", "Wait for the host to start the game");
      socket
        .to(code)
        .emit("message", `${username || "Player"} joined the lobby`);
      return;
    }
  }
};

/**
 * Leave Game
 * @description Executes when user leaves the game or gets disconnected
 * @param {*} io
 * @param {*} socket
 */
export const leaveGame = async (io, socket) => {
  const { username } = socket.handshake.auth;
  let games = await GameModel.find({
    players: { $elemMatch: { username } },
  });
  games = JSON.parse(JSON.stringify(games));

  if (games.length) {
    await GameModel.updateMany(
      { players: { $elemMatch: { username } } },
      { $pull: { players: { username } } }
    );

    for (let game of games) {
      try {
        const player = game.players.find(
          (player) => player.username == username
        );
        socket.leave(game.code);
        if (player) {
          io.in(game.code).emit(
            "message",
            `${username || "Player"} leaves the lobby`
          );
        }

        if (game.players.length) {
          io.in(game.code).emit("joined-lobby", {
            code: game.code,
            players: game.players.filter(
              (player) => player.username !== username
            ),
          });
        }
      } catch (error) {
        socket.error('error', 'Something went wrong when trying to leave the game');
      }
    }
  }
};

/**
 * Start Game
 * @description Executes when host started the game
 * @param {*} io
 * @param {*} socket
 * @param {*} game
 * @returns
 */
export const startGame = async (io, socket, game) => {
  const { code, rounds } = game;
  console.log('gogoo');

  try {
    const game = await GameModel.findOne({ code });

    if (!game) {
      io.in(game.code).emit("error", "Invalid game");
      return;
    }

    // Added Computer Player
    const computer = Array(5 - game.players.length)
      .fill(0)
      .map((_, index) => ({
        computer: true,
        credits: 100,
        username: "Computer#" + Number(game.players.length + index + 1),
      }));

    console.log('something went wrong', 'whatup');

    await GameModel.updateOne(
      { code },
      {
        isStarted: true,
        $push: {
          players: computer,
          history: {
            round: 1,
            secretNumber: generateSecretNumber(),
          },
        },
        numberOfUser: game.players.length,
        currentRound: 1,
      }
    );
    const start = await GameModel.findOne({ code });

    console.log('something went wrong', start);
    io.in(game.code).emit("game-start", start);
  } catch (error) {
    console.log(error);
    io.in(game.code).emit("error", "Something went wrong");
  }
};

/**
 * Guess a number for the round
 * @description Callback listener for when the user guess a number
 * @param {*} io
 * @param {*} socket
 * @param {*} payload
 * @returns
 */
export const setGuessForTheRound = async (io, socket, payload) => {
  const { code, guess, username } = payload;

  let game = await GameModel.findOne({ code });

  if (!game) {
    socket.emit("error", "Game does not exists anymore");
    return;
  }

  await GameModel.updateOne(
    { code },
    {
      $push: {
        [`history.${game.currentRound - 1}.players`]: {
          username,
          guess,
          won: false,
        },
      },
    }
  );

  // IF ALL USERS HAVE ALREADY GUESSED ADD COMPUTER GUESS
  game = await GameModel.findOne({ code });

  let currentRound = game.history.find(
    ({ round }) => round === game.currentRound
  );
  if (currentRound.players.length >= game.numberOfUser) {
    for (let i = game.numberOfUser; i < 5; i++) {
      // Add the  uess of the Computer Player
      await GameModel.updateOne(
        { code },
        {
          $push: {
            [`history.${game.currentRound - 1}.players`]: {
              username: game.players[i].username,
              guess: generateSecretNumber(),
              won: false,
            },
          },
        }
      );
    }
    game = await GameModel.findOne({ code });
    currentRound = game.history.find(
      ({ round }) => round === game.currentRound
    );
    const roundIndex = game.history.findIndex(
      ({ round }) => round === game.currentRound
    );

    // Deduct 10 credits to all players
    for (let i = 0; i < game.players.length; i++) {
      let updatedCredits = game.players[i].credits - DEDUCTION;
      await GameModel.updateOne(
        {
          code,
        },
        {
          $set: {
            [`players.${i}.credits`]: updatedCredits,
          },
        }
      );
    }
    game = await GameModel.findOne({ code });
    // Send a message to all players in the current game for the deduction
    io.in(code).emit("message", "10 credits is deducted to your account");
    // Update game object in frontend
    io.in(code).emit('update-game', { game })


    for (let i = 0; i < game.players.length; i++) {
      let updatedCredits = game.players[i].credits;
      let isRoundWon = false;
      if (currentRound.secretNumber >= currentRound.players[i].guess) {
        updatedCredits += currentRound.players[i].guess * 10;
        isRoundWon = true;
      }
      // Checks if player gets rewards or not then update the players credits
      await GameModel.updateOne(
        {
          code,
        },
        {
          $set: {
            [`players.${i}.credits`]: updatedCredits,
            [`history.${roundIndex}.players.${i}.won`]: isRoundWon
          },
        }
      );
    }
    game = await GameModel.findOne({ code });
    currentRound = game.history.find(
      ({ round }) => round === game.currentRound
    );

    // If there's a next round create. Prepare the next round.
    if (game.rounds > game.currentRound) {
      await GameModel.updateOne(
        { code },
        {
          currentRound: game.currentRound + 1,
          $push: {
            history: {
              round: game.currentRound + 1,
              secretNumber: generateSecretNumber(),
            },
          },
        }
      );
      game = await GameModel.findOne({ code });

      // Continue to next round
      io.in(code).emit("round-play", { game, currentRound, gameOver: false });
    } else {
      for (let i = 0; i < game.players.length; i++) {
        const $player = game.players[i];
        if (!$player?.computer) {
          await UserModel.updateOne(
            { username: $player.username },
            {
              credits: $player.credits,
            }
          );
        }
      }

      // Game ended says thanks for playing
      io.in(code).emit("round-play", { game, currentRound, gameOver: true });
    }
  } else {
    // Wait till all human player guessed a number
    socket.emit("round-wait", { waiting: true });
  }
};

/**
 * Player leaves lobby
 * @param {*} io
 * @param {*} socket
 * @param {*} param2
 */
export const onLeaveLobby = async (io, socket, { code, username }) => {
  const user = await UserModel.findOne({ username });

  socket.emit('update-user', { user });
  socket.emit('leave-lobby', { code });
}
