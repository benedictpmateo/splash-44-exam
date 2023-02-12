import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react";
import PageLayout from "@/components/layout/PageLayout";
import ContainerLayout from "@/components/layout/ContainerLayout";
import { useGameContext } from "@/context/GameContext";
import { useState } from "react";
import RadioCard from "../misc/RadioCard";
import { generateCode } from "@/utils/generate";

const LOBBY_CONFIG = {
  CODE: "Join by Code",
  CREATE: "Create New",
};

const LOBBY_OPTIONS = Object.values(LOBBY_CONFIG);

const MainScreen = () => {
  // Game Context
  const { game, update } = useGameContext();

  // States
  const [lobby, setLobby] = useState(LOBBY_CONFIG.CREATE);
  const [rounds, setRounds] = useState();
  const [code, setCode] = useState();

  const onChangeLobbyConfig = (data) => {
    setLobby(data);
    switch (data) {
      case LOBBY_CONFIG.CODE:
      case LOBBY_CONFIG.CREATE:
        setCode("");
        setRounds("");
        break;
    }
  };

  // Used for the custom Radio Button for Lobby Config
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "LobbyConfig",
    defaultValue: LOBBY_CONFIG.CREATE,
    onChange: onChangeLobbyConfig,
  });
  const group = getRootProps();

  const onStartGame = () => {
    // All conditions are just simple form validations
    if (game.user.username) {
      let lobbyCode;
      if (lobby === LOBBY_CONFIG.CODE && code && code.length === 6) {
        lobbyCode = String(code).toLocaleUpperCase();
        // Means the user joined is a joiner
        update({
          isLobby: true,
          lobbyConfig: {
            code: lobbyCode,
            type: "join",
          },
        });
      } else if (
        lobby === LOBBY_CONFIG.CREATE &&
        Number.isInteger(parseInt(rounds)) &&
        rounds <= 10
      ) {
        // Means the user joined is a host
        lobbyCode = generateCode();
        update({
          isLobby: true,
          lobbyConfig: {
            code: lobbyCode,
            rounds,
            type: "create",
          },
        });
      }
    }
  };

  const onExitGame = () => {
    update({
      isMain: false,
    });
  };

  return (
    <PageLayout title="MainScreen">
      <ContainerLayout pt="80px">
        <Flex justifyContent="space-between" align="center">
          <Heading fontWeight={600} fontSize="32px">
            Game Menu
          </Heading>

          <Button
            variant="solid"
            colorScheme="red"
            onClick={() => onExitGame()}
          >
            Logout
          </Button>
        </Flex>

        <Text>[ Username ]: {game.user?.username}</Text>
        <Text>[ Credits ]: {game.user?.credits} credits</Text>
        <Flex mt="10" gap="10" flexDir={{ base: "column", lg: "row" }}>
          <Box
            flex="1"
            borderColor="brand.border"
            borderWidth={1}
            bg="brand.bg"
            rounded="32px"
            py="6"
            px="10"
          >
            <Heading fontWeight={600} fontSize="24px" color="text.dark">
              Lobby Config
            </Heading>
            <Flex gap="4">
              <VStack {...group} mt="4" textAlign="left" align="flex-start">
                {LOBBY_OPTIONS.map((value) => {
                  const radio = getRadioProps({ value });
                  return (
                    <RadioCard key={value} {...radio}>
                      {value}
                    </RadioCard>
                  );
                })}
              </VStack>
              {lobby === LOBBY_CONFIG.CODE && (
                <Box w="100%">
                  <Input
                    placeholder="Please input lobby 6 character code"
                    h="10"
                    w="100%"
                    borderColor="brand.border"
                    borderWidth={1}
                    px="4"
                    py="2"
                    rounded="8px"
                    mt="5"
                    maxLength="6"
                    onChange={(e) => setCode(e.target.value)}
                  ></Input>
                  {!Boolean(code) && (
                    <Text
                      fontSize="12px"
                      mt="1"
                      color="brand.danger"
                      fontWeight={600}
                    >
                      Code is required
                    </Text>
                  )}
                  {Boolean(code && code.length < 6) && (
                    <Text
                      fontSize="12px"
                      mt="1"
                      color="brand.danger"
                      fontWeight={600}
                    >
                      Code must have 6 characters
                    </Text>
                  )}
                </Box>
              )}
              {lobby === LOBBY_CONFIG.CREATE && (
                <Box w="100%">
                  <Input
                    placeholder="Set number of rounds (max 10)"
                    h="10"
                    w="100%"
                    borderColor="brand.border"
                    borderWidth={1}
                    px="4"
                    py="2"
                    rounded="8px"
                    mt="5"
                    maxLength="2"
                    max={10}
                    onChange={(e) => setRounds(e.target.value)}
                  ></Input>

                  {(!Boolean(rounds) ||
                    !Number.isInteger(parseInt(rounds))) && (
                    <Text
                      fontSize="12px"
                      mt="1"
                      color="brand.danger"
                      fontWeight={600}
                    >
                      Number of rounds is required
                    </Text>
                  )}
                  {Number.isInteger(parseInt(rounds)) && rounds > 10 && (
                    <Text
                      fontSize="12px"
                      mt="1"
                      color="brand.danger"
                      fontWeight={600}
                    >
                      Can only have max of 10 rounds
                    </Text>
                  )}
                </Box>
              )}
              {lobby === LOBBY_CONFIG.ANY && <Text mt="6">Join any game</Text>}
            </Flex>
          </Box>
        </Flex>
        <Flex mt="10" justifyContent="center">
          <Button
            variant="solid"
            colorScheme="green"
            w="100%"
            onClick={onStartGame}
          >
            Start Game
          </Button>
        </Flex>
      </ContainerLayout>
    </PageLayout>
  );
};

export default MainScreen;
