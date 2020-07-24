const express = require("express");
const accountsRouter = require("../accountsRouter");
const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());
server.use("/api/accounts", accountsRouter);

server.get("/", async (req, res, next) => {
  try {
    res.status(200).json({ server: "running", name: "node-db1" });
  } catch (error) {
    next({ status: 500, errorMessage: "Unable to access server" });
  }
});

function errorHandling(error, req, res, next) {
  res.status(error.status).json({ error: error.errorMessage });
}

server.use(errorHandling);

module.exports = server;
