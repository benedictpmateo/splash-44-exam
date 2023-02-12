import { GAME_STATUS, useGameContext } from "@/context/GameContext";
import {
  Box,
  Button,
  FormControl,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ContainerLayout from "../layout/ContainerLayout";
import PageLayout from "../layout/PageLayout";
import dynamic from "next/dynamic";
const BarGraph = dynamic(import("@/components/graph/Graph"), {
  ssr: false,
});

const timeout = async (seconds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, seconds);
  });
};

const Game = ({ socket }) => {
  const { game, update } = useGameContext();
  const { currentGame, currentRound, user } = game;
  const { username } = user;
  const { code, rounds, players } = currentGame;
  const [waiting, setWaiting] = useState(false);
  const [secretGuess, setSecretGuess] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [_data, setData] = useState([0, 0, 0, 0, 0]);
  const [_players, setPlayers] = useState(['--', '--', '--', '--', '--']);
  const [guess, setGuess] = useState(0);
  const toast = useToast();

  useEffect(() => {
    socket.emit("ping", "connect");
    socket.on("pong", () => {
      setPlayers(() => currentGame.players.map((player) => player.username));
    });

    socket.on("message", (msg) => {
      console.log(msg);
    });

    socket.on("round-wait", () => {
      setWaiting(true);
    });

    socket.on("round-play", async (payload) => {
      const { game: $game, currentRound, gameOver } = payload;
      setGuess("");

      const item = currentRound.players.find(
        (player) => player.username == username
      );
      console.log(currentRound, item);
      setWaiting(true);

      update({
        status: GAME_STATUS.ROUND_START,
      });
      await timeout(2000);

      setShowResult(true);
      setSecretGuess(currentRound.secretNumber);
      setData(() =>
        $game.players.map((player) => {
          const user = currentRound.players.find(
            ({ username }) => username == player.username
          );
          return user.guess;
        })
      );
      setPlayers(() => $game.players.map((player) => player.username));
      await timeout(2500);

      if (item.won) {
        toast({
          status: "success",
          title: "Round won",
          description: `You won ${item.guess * 10} credits`,
          position: "top-right",
        });
      } else {
        toast({
          status: "error",
          title: "Round lose",
          description: "Try again to win credits",
          position: "top-right",
        });
      }
      update({
        status: GAME_STATUS.ROUND_OVER,
      });

      // RESET
      setWaiting(false);
      update({
        currentGame: $game,
        currentRound: $game.currentRound,
      });

      await timeout(10000);
      setSecretGuess(0);
      setShowResult(false);
      setData([0, 0, 0, 0, 0]);

      if (gameOver) {
        toast({
          status: "info",
          title: "Game over",
          description: "Thanks for playing the game",
          position: "top-right",
        });
        update({
          status: GAME_STATUS.LOBBY,
        });
        socket.emit('leave-lobby', { code, username })
      } else {
        update({
          status: GAME_STATUS.ROUND_START,
        });
      }
    });

    socket.on("update-user", ({ user }) => {
      console.log(user);
      update({
        user,
      });
    });
    socket.on("update-game", ({ game }) => {
      update({
        currentGame: game,
      });
    });

    socket.on("game-over", async (payload) => {
      const { game: $game } = payload;
      console.log("game over", $game);
    });

    socket.on('leave-lobby', ({ code, username }) => {
      update({
        isLobby: false,
        lobbyConfig: {
          user: null,
          code: '',
          rounds: 0,
          type: '',
        }
      })
    })
    return () => {
      socket.removeAllListeners("pong");
    };
  }, []);

  const onGuess = (value) => {
    if (
      value &&
      Number.isInteger(parseInt(value)) &&
      parseFloat(value) > -1 &&
      10 > parseFloat(value)
    ) {
      console.log("on guess", { code, guess: parseFloat(value), username });
      socket.emit("submit-guess", { code, guess: parseFloat(value), username });
    }
  };

  return (
    <PageLayout title="Game">
      <ContainerLayout py="80px">
        <Box mx="auto" w="500px">
          <Text fontSize="32px" fontWeight={600}>
            Round {currentRound}/{currentGame.rounds}
          </Text>
          <Text>
            [ Username ]: <b>{username}</b>
          </Text>
          <Text>
            [ Credits ]:{" "}
            <b>
              {currentGame?.players && currentGame.players?.length
                ? currentGame.players.find(
                    (player) => player.username === username
                  ).credits
                : 0}{" "}
              credits
            </b>
          </Text>
          <Box w="500px" h="500px">
            <BarGraph
              secretGuess={secretGuess}
              items={_data}
              players={_players}
            />
          </Box>
          <Box mt="10" maxW="500px" w="100%">
            <Text mb="2">Guess the secret number from 0 to 9.99</Text>
            <FormControl w="100%">
              <Input
                w="100%"
                value={guess}
                onChange={(e) => setGuess(e.currentTarget.value)}
              />
            </FormControl>
            {showResult ? (
              <Text>Game processing...</Text>
            ) : waiting ? (
              <Text>Waiting for other players</Text>
            ) : (
              <Button
                mt="4"
                w="100%"
                colorScheme="twitter"
                onClick={() => onGuess(guess)}
              >
                Submit Guess
              </Button>
            )}
          </Box>
        </Box>
      </ContainerLayout>
    </PageLayout>
  );
};

export default Game;
