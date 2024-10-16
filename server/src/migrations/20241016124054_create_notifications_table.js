exports.up = function (knex) {
  return knex.schema.createTable("notifications", (table) => {
    table.increments("id").primary();
    table
      .integer("job_id")
      .unsigned()
      .references("id")
      .inTable("jobs")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.string("message").notNullable();
    table.string("type").notNullable();
    table.string("status").notNullable().defaultTo("pending");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("notifications");
};
