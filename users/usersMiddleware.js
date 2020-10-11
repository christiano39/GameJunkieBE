const Users = require("./usersModel");

module.exports = {
  validateUser,
  validateUserId,
};

function validateUser(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Please provide username and password" });
  } else {
    next();
  }
}

function validateUserId(req, res, next) {
  const id = req.params.id;

  Users.getById(id)
    .then((user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ error: `User with id ${id} does not exist` });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}
