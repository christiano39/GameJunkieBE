const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("../auth/authRoutes");
const usersRoutes = require("../users/usersRoutes");
const commentsRoutes = require("../comments/commentsRoutes");
const personalRoutes = require("../users/personalRoutes");
const gameCommentsRoutes = require("../comments/gameCommentsRoutes");
const gamesRoutes = require("../games/gamesRoutes");

const {
  requiresToken,
  requiresAdmin,
} = require("../restricted/restrictedMiddleware");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/auth", authRoutes);
server.use("/api/users", requiresToken, requiresAdmin, usersRoutes);
server.use("/api/comments", requiresToken, requiresAdmin, commentsRoutes);
server.use("/api/my", requiresToken, personalRoutes);
server.use("/api/game", gameCommentsRoutes);
server.use("/api/games", gamesRoutes);

module.exports = server;
