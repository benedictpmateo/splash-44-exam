import mongoose from "mongoose";
import { config } from "dotenv";
config();

const mongooseConnect = async () => {
  mongoose.set('strictQuery', false);
  await mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_NAME
    })
    .then((res) => {
      console.log(
        "DB connected to %s:%s, db: %s",
        res.connection.host,
        res.connection.port,
        res.connection.db.databaseName
      );
    })
    .catch((e) => {
      console.log(`Cannot connect to the database with error: ${e}`);
    });
};

export { mongooseConnect };
