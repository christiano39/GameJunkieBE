const db = require("../data/dbConfig");

module.exports = {
  getById,
  removeComment,
  removeCommentIfUser,
  addComment,
  getGameComments,
};

function getById(id) {
  return db("game_comments").where({ id }).first();
}

function removeComment(id) {
  return db("game_comments").where({ id }).del();
}

function removeCommentIfUser(id, user_id) {
  return db("game_comments").where({ id, user_id }).del();
}

function addComment(body) {
  return db("game_comments")
    .insert(body)
    .returning("id")
    .then(([id]) => {
      return getById(id);
    });
}

function getGameComments(game_id) {
  return db("game_comments as gc")
    .join("users as u", "u.id", "gc.user_id")
    .where({ "gc.game_id": game_id })
    .select(
      "gc.id as id",
      "u.id as user_id",
      "u.username as author",
      "gc.comment as comment"
    )
    .orderBy("gc.id", "desc");
}
