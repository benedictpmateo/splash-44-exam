import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    code: String,
    rounds: Number,
    isStarted: Boolean,
    currentRound: Number,
    numberOfUser: Number,
    // Used for lobby
    players: [{
      username: String,
      computer: Boolean,
      credits: Number,
      isHost: Boolean,
      id: Number,
    }],
    history: [{
      round: Number,
      secretNumber: Number,
      players: [{
        username: String,
        guess: Number,
        won: Boolean,
      }]
    }],
  },
  {
    timestamps: true,
  }
);

export const GameModel = mongoose.model("games", schema);
