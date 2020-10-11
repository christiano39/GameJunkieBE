const bcrypt = require("bcryptjs");

const rounds = parseInt(process.env.HASH_ROUNDS) || 8;
const adminPassword = process.env.ADMIN_PASSWORD || "testing";

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          username: "Chris",
          password: bcrypt.hashSync(adminPassword, rounds),
          admin: true,
        },
      ]);
    });
};
