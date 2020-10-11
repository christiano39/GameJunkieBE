const db = require("../data/dbConfig");

module.exports = {
  getGameComments,
};

function getGameComments(game_id) {
  return db("users as u")
    .join("game_comments as g")
    .where({ "g.game_id": game_id })
    .select("g.id", "u.username as author", "g.comment")
    .orderBy("g.id", "desc");
}
