const router = require("express").Router();
const Comments = require("./commentsModel");

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Comments.removeComment(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
