import { useGameContext } from "@/context/GameContext";
import MainScreen from "@/components/screens/MainScreen";
import WelcomeScreen from "@/components/screens/WelcomeScreen";
import LobbyScreen from "@/components/screens/LobbyScreen";

const Home = () => {
  const { game } = useGameContext();
  return (
    <>
      {game.isLobby ? (
        <LobbyScreen />
      ) : game.isMain ? (
        <MainScreen />
      ) : (
        <WelcomeScreen />
      )}
    </>
  );
};

export default Home;
