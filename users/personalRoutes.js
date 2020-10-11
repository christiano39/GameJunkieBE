const router = require("express").Router();
const Users = require("./usersModel");
const Comments = require("../comments/commentsModel");
const { validateUser, validateUserId } = require("./usersMiddleware");

//favorites
router.get("/favorites", (req, res) => {
  const id = req.jwt.subject;

  Users.getUserFavorites(id)
    .then((favorites) => {
      res.status(200).json({ favorites });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post("/favorites", (req, res) => {
  const { game_id } = req.body;

  if (!game_id) {
    res.status(400).json({ error: "Please include game_id" });
  }

  Users.addFavorite(req.jwt.subject, game_id).then(() => {
    res.status(200).json({ message: "Favorited" });
  });
});

router.delete("/favorites/:id", (req, res) => {
  const game_id = req.params.id;

  Users.removeFavorite(req.jwt.subject, game_id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

//comments
router.post("/comments", (req, res) => {
  const { game_id, comment } = req.body;

  if (!game_id || !comment) {
    res.status(400).json({ error: "Please include game_id and comment" });
  }

  const newComment = { user_id: req.jwt.subject, game_id, comment };

  Comments.addComment(newComment)
    .then((comment) => {
      res.status(201).json({ comment });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/comments", (req, res) => {
  const id = req.jwt.subject;

  Users.getUserComments(id)
    .then((comments) => {
      res.status(200).json({ comments });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.delete("/comments/:id", (req, res) => {
  const user_id = req.jwt.subject;
  const id = req.params.id;

  Comments.removeCommentIfUser(id, user_id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
