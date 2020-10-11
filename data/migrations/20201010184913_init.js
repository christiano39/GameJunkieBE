exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments("id");

      tbl.string("username", 100).notNullable().unique().index();
      tbl.string("password").notNullable();
      tbl.boolean("admin").defaultTo(false);
    })
    .createTable("user_favorites", (tbl) => {
      tbl.increments("id");

      tbl
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("users.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");

      tbl.integer("game_id").unsigned().notNullable();
    })
    .createTable("game_comments", (tbl) => {
      tbl.increments();

      tbl
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("users.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");

      tbl.integer("game_id").unsigned().notNullable();
      tbl.string("comment", 255);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("game_comments")
    .dropTableIfExists("user_favorites")
    .dropTableIfExists("users");
};
