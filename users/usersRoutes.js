const router = require("express").Router();
const Users = require("./usersModel");
const bcrypt = require("bcryptjs");
const { validateUser, validateUserId } = require("./usersMiddleware");

router.get("/", (req, res) => {
  Users.getAll()
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.post("/", validateUser, (req, res) => {
  let { username, password, admin } = req.body;

  if (!admin) {
    admin = false;
  }

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

  Users.add({ username, password: hash, admin })
    .then((user) => {
      res.status(201).json({ message: "User created successfully", user });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  const password = req.body.password;

  const rounds = parseInt(process.env.HASH_ROUNDS) || 8;
  const hash = bcrypt.hashSync(password, rounds);

  Users.update(id, { ...changes, password: hash })
    .then((user) => {
      res
        .status(200)
        .json({ message: `User with id ${id} updated successfully`, user });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  const id = req.params.id;

  Users.remove(id)
    .then((deletedUser) => {
      res.status(200).json({
        message: `User with id ${id} deleted successfully`,
        deletedUser,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/:id/comments", validateUserId, (req, res) => {
  const id = req.params.id;

  Users.getUserComments(id)
    .then((comments) => {
      res.status(200).json({ comments });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
