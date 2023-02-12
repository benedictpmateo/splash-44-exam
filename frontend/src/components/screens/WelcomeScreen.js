import { Box, Button, Heading, Input, Text } from "@chakra-ui/react";
import PageLayout from "@/components/layout/PageLayout";
import ContainerLayout from "@/components/layout/ContainerLayout";
import { useGameContext } from "@/context/GameContext";
import { useState } from "react";
import axios from 'axios'
import { config } from "@/utils/config";

const WelcomeScreen = () => {
  // Game Context
  const { update } = useGameContext();

  // States
  const [username, setUsername] = useState('');

  const onJoinGame = async () => {
    if (username) {
      try {
      const { data } = await axios.post(config.apiUrl + '/users', {
        username
      })
      update({
        isMain: true,
        user: data.user,
      })
      } catch (error) {

      }
    }
  };

  return (
    <PageLayout title="Home">
      <ContainerLayout pt="80px">
        <Box>
          <Heading fontWeight={600} fontSize="32px">
            Welcome to Guessing Game
          </Heading>
          <Text fontSize="16px">Guess the secret number to win credits</Text>
          <Box
            maxW="500px"
            w="100%"
            mt="4"
            flex="1"
            borderColor="brand.border"
            borderWidth={1}
            bg="brand.bg"
            rounded="32px"
            py="6"
            px="10"
          >
            <Heading fontWeight={600} fontSize="24px" color="text.dark">
              Enter your username
            </Heading>
            <Text fontSize="12px">
              This is only a simple auth (joining with username will automatically create a new account or login into the game if username already exists)
            </Text>
            <Text fontSize="12px" color="twitter.600" fontWeight={600}>
              NOTE: User game history is also attached to the username
            </Text>

            <Input
              placeholder="Please input your username"
              h="10"
              w="100%"
              borderColor="brand.border"
              borderWidth={1}
              isRequired
              required
              px="4"
              py="2"
              rounded="8px"
              mt="4"
              onChange={(e) => setUsername(e.currentTarget.value)}
            ></Input>
            {!Boolean(username) && (
              <Text
                fontSize="12px"
                mt="1"
                color="brand.danger"
                fontWeight={600}
              >
                Username is required
              </Text>
            )}
            <Button
              mt="6"
              variant="solid"
              colorScheme="messenger"
              onClick={() => onJoinGame()}
            >
              Proceed to game
            </Button>
          </Box>
        </Box>
      </ContainerLayout>
    </PageLayout>
  );
};

export default WelcomeScreen;
