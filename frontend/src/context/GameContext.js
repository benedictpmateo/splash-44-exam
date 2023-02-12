import { useContext, useState, createContext } from "react";
import immutability from "immutability-helper";

export const GAME_STATUS = {
  LOBBY: 1,
  STARTED: 2, // when host started the game
  ROUND_START: 3, // when animating with 10 seconds delay + 10 seconds animation
  ROUND_OVER: 4, // when showing result
  GAME_OVER: 5, // when all rounds is over,
  LEADERBOARD: 6,
};

const initialState = {
  user: null, // current user
  status: GAME_STATUS.LOBBY, // used to change screens
  currentRound: 1, // current game round
  currentGame: null, // current game object
  isMain: false,
  isLobby: false,

  // Game Lobby Config
  lobbyConfig: {
    user: null,
    code: '',
    rounds: 0,
    type: '',
  },
}

const GameContext = createContext({
  game: initialState,
  update: () => ({}),
});

const GameProvider = ({ children }) => {
  const [game, setGame] = useState(initialState);

  // Use to update any value in the state object
  const update = (payload) => {
    setGame((value) =>
      immutability(value, {
        $merge: {
          ...payload,
        },
      })
    );
  };

  return (
    <GameContext.Provider value={{ game, update }}>
      {children}
    </GameContext.Provider>
  );
};

const useGameContext = () => {
  return useContext(GameContext);
};

export { useGameContext, GameProvider };
