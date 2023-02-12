import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from 'cors';
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";

var app = express();

export const corsOptions = {
  origin: function (origin, callback) {
    var whitelist = [
      "http://localhost:3000",
      "https://splash-44-exam.vercel.app",
    ];
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use("/", indexRouter);

app.use(cors(corsOptions))
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(path.dirname("public"))));

app.use("/users", usersRouter);

export default app;
