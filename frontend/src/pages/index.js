import { useGameContext } from "@/context/GameContext";
import MainScreen from "@/components/screens/MainScreen";
import WelcomeScreen from "@/components/screens/WelcomeScreen";
import LobbyScreen from "@/components/screens/LobbyScreen";
import { Box, Flex, Text } from "@chakra-ui/react";
import ContainerLayout from "@/components/layout/ContainerLayout";

const Home = () => {
  const { game } = useGameContext();
  return (
    <Box>
      <ContainerLayout h="100px">
        <Flex
          align="center"
          h="100px"
          borderBottom="4px solid"
          borderColor="brand.border"
        >
          <Box>
            <Text>
              Author: <b>Benedict Mateo</b>
            </Text>
            <Text>
              Exam:{" "}
              <a
                href="https://github.com/SplashSoftware/fullstack-44/blob/main/Instruction.txt"
                target="_blank"
              >
                https://github.com/SplashSoftware/fullstack-44/blob/main/Instruction.txt
              </a>
            </Text>
          </Box>
        </Flex>
      </ContainerLayout>
      <Box minH="calc(100vh - 100px)">
        {game.isLobby ? (
          <LobbyScreen />
        ) : game.isMain ? (
          <MainScreen />
        ) : (
          <WelcomeScreen />
        )}
      </Box>
    </Box>
  );
};

export default Home;
