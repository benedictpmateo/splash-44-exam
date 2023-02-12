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
  user: null,
  status: GAME_STATUS.LOBBY,
  currentRound: 1,
  currentGame: null,
  isMain: false,
  isLobby: false,
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
