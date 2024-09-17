const express = require("express");
const mongoose = require("mongoose");

require('dotenv').config()
const config = require("./config/config");
const { expressConfig } = require("./config/express.config");
const authRouter = require("./routes/auth.routes");
const { connection } = require("./database/connection.js");
const { errorHandlingMiddlware } = require("./middleware/error.handler.js");
const cors = require('cors')
const app = express();

app.use(cors())

expressConfig(app);

connection(mongoose, config, {
  autoIndex: false,
  connectTimeoutMS: 1000,
}).connectToMongo();

app.get("/auth", (req, res) => res.send("ok"));

app.use("/auth", authRouter);

app.use(errorHandlingMiddlware);

const server = app.listen(config.port, () => {
  console.log("Server Started!", config.port);
});

process.on("SIGINT", () => {
  console.log("SIGINT received");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  process.exit(0);
});
process.on("uncaughtException", (err) => {
  console.log("Loggeqd Error: ", err);
});
process.on("unhandledRejection", (err) => {
  console.log("Logged Error: ", err);
  server.close(() => process.exit(1));
});
