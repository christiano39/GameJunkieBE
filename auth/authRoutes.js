const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../users/usersModel");
const secret = require("../config/jwtSecret");
const { validateUser } = require("../users/usersMiddleware");

router.post("/register", validateUser, (req, res) => {
  const { username, password } = req.body;

  Users.getBy({ username })
    .then(([user]) => {
      if (user) {
        res.status(409).json({ error: "Username is already taken" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });

  const rounds = parseInt(process.env.HASH_ROUNDS) || 8;
  const hash = bcrypt.hashSync(password, rounds);

  Users.add({ username, password: hash })
    .then((user) => {
      const token = signToken(user);
      res
        .status(201)
        .json({ message: "User registered successfully", user, token });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post("/login", validateUser, (req, res) => {
  const { username, password } = req.body;

  Users.getBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = signToken(user);
        res.status(200).json({ welcome: `${user.username}`, user, token });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;

function signToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    admin: user.admin,
  };

  const options = {
    expiresIn: process.env.TOKEN_EXPIRATION || "10d",
  };

  return jwt.sign(payload, secret, options);
}
