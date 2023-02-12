import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    credits: Number,
    username: String,
    gameHistory: [
      {
        code: String,
        lastCredit: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("users", schema);
