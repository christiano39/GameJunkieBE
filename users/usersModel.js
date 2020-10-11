const db = require("../data/dbConfig");

module.exports = {
  getById,
  getBy,
  add,
  update,
  remove,
  getUserComments,
  getUserFavorites,
};

function getById(id) {
  return db("users").where({ id }).first();
}

function getBy(filter) {
  return db("users").where(filter).orderBy("id");
}

function add(user) {
  return db("users")
    .insert(user)
    .returning("id")
    .then(([id]) => {
      return getById(id);
    });
}

function update(id, changes) {
  return db("users")
    .where({ id })
    .update(changes)
    .then(() => {
      return getById(id);
    });
}

function remove(id) {
  let removedUser = null;

  getById(id).then((user) => {
    removedUser = user;
  });

  return db("users")
    .where({ id })
    .del()
    .then(() => {
      return removedUser;
    });
}

function getUserComments(user_id) {
  return db("game_comments").where({ user_id }).orderBy("id", "desc");
}

function getUserFavorites(user_id) {
  return db("user_favorites").where({ user_id }).orderBy("id", "desc");
}
