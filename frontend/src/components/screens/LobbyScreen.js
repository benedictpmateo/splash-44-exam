import { GAME_STATUS, useGameContext } from "@/context/GameContext";
import { config } from "@/utils/config";
import {
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Game from "../game";
import ContainerLayout from "../layout/ContainerLayout";
import PageLayout from "../layout/PageLayout";

var socket;
const LobbyScreen = () => {
  const { game, update } = useGameContext();

  const { code, type, rounds } = game.lobbyConfig;
  const user = game?.user;
  const { username } = user;

  const isHost = type == "create";
  const [players, setPlayers] = useState([]);
  const [gameRounds, setGuessForTheRounds] = useState(0);
  const toast = useToast();

  useEffect(() => {
    socket = io(config.websocket, {
      auth: {
        username,
      },
      retries: 20,
    });
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);
    socket.on("joined-lobby", onJoinedLobby);
    socket.on("error", onError);
    socket.on("game-start", onGameStart);
    return () => {
      socket.disconnect();
    };
  }, []);

  const onConnect = () => {
    socket.emit("join", {
      code,
      user,
      isHost,
      rounds,
    });
  };

  const onDisconnect = () => {
    toast({
      status: "error",
      title: "Game disconnected",
      description: "Game is over, create new game",
      position: "top-right",
    });
    setTimeout(() => {
      update({
        isLobby: false,
        lobbyConfig: {
          user: null,
          code: "",
          rounds: 0,
          type: "",
        },
      });
    }, 2000);
    socket.removeAllListeners();
  };

  const onMessage = (message) => {
    toast({
      status: "info",
      title: "Game message",
      description: message,
      position: "top-right",
    });
  };

  const onJoinedLobby = (game) => {
    if (game.code === code) {
      setGuessForTheRounds(game.rounds);
      setPlayers(game.players);
    }
  };

  const onError = (message) => {
    toast({
      status: "error",
      title: "Game notice",
      description: message,
      position: "top-right",
    });

    update({
      isLobby: false,
      lobbyConfig: {
        user: null,
        code: "",
        rounds: 0,
        type: "",
      },
    });
  };

  const onStartGame = () => {
    socket.emit("start", { code, rounds });
  };

  const onGameStart = (game) => {
    update({
      currentRound: 1,
      currentGame: game,
      status: GAME_STATUS.STARTED,
    });
  };

  if (game.status > GAME_STATUS.LOBBY) {
    return <Game socket={socket} />;
  }

  return (
    <PageLayout title={`Lobby #${game.lobbyConfig.code}`}>
      <ContainerLayout py="10">
        <Flex fontSize="20px" gap="2" align="center">
          🎮 Lobby Code:{" "}
          <Text as="span" fontWeight={600}>
            {game.lobbyConfig.code}
          </Text>
          <Button
            colorScheme="orange"
            onClick={() =>
              window &&
              window.navigator.clipboard.writeText(game.lobbyConfig.code)
            }
            py="2"
            h="32px"
          >
            Copy
          </Button>
        </Flex>
        <Heading mt="4" fontSize="24px" fontWeight={600}>
          Number of Rounds: {gameRounds}
        </Heading>

        <Flex mt="10" gap="6" flexDir={{ base: "column", md: "row" }}>
          <Box
            width={{ base: "100%", md: "300px" }}
            borderColor="brand.border"
            borderWidth={1}
            bg="brand.bg"
            px="10"
            py="6"
            rounded="24px"
          >
            <Heading fontSize="24px" fontWeight={600}>
              🥷 Players
            </Heading>
            <List mt="2">
              {players.map((player, i) => (
                <ListItem
                  key={player.username}
                  color={
                    player.username === username ? "brand.main" : "brand.black"
                  }
                  fontWeight={player.username === username ? 600 : 400}
                >
                  -{" "}
                  {player.username === username
                    ? `${player.username} (You)`
                    : `${player.username}`}
                </ListItem>
              ))}
              {Array(5 - players.length)
                .fill(0)
                .map((ai, index) => (
                  <ListItem key={index} color="text.light" textStyle="italic">
                    [ Slot #{players.length + index + 1} ]
                  </ListItem>
                ))}
            </List>
            {isHost ? (
              <Button
                mt="10"
                colorScheme="twitter"
                onClick={() => onStartGame()}
              >
                Start Game
              </Button>
            ) : (
              <Text mt="10" color="text.light">
                Waiting for host...
              </Text>
            )}
          </Box>
          <Box
            width="100%"
            borderColor="brand.border"
            borderWidth={1}
            bg="brand.bg"
            px="10"
            py="6"
            rounded="24px"
          >
            <Heading fontSize="24px" fontWeight={600}>
              📝 Note
            </Heading>
            <List mt="2">
              <ListItem>
                * If <span style={{ fontWeight: 600 }}>[ Slots ]</span> are not
                occupied it will be replaced by a computer when game started
              </ListItem>
              <ListItem>* Can only have 5 players</ListItem>
            </List>

            <Heading mt="2" fontSize="24px" fontWeight={600}>
              🎮 Gameplay
            </Heading>
            <List mt="2">
              <ListItem>* Guess the secret number to win credits!</ListItem>
              <ListItem>
                * Every game you will have 100 credits to be used for each
                round.
              </ListItem>
              <ListItem>
                * Random number will be generated between 0 to 9.99
              </ListItem>
            </List>
          </Box>
        </Flex>
      </ContainerLayout>
    </PageLayout>
  );
};

export default LobbyScreen;
