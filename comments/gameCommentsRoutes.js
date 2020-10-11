const router = require("express").Router();
const Comments = require("./commentsModel");

router.get("/:id/comments", (req, res) => {
  const id = req.params.id;

  Comments.getGameComments(id)
    .then((comments) => {
      res.status(200).json({ comments });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
