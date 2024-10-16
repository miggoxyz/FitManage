exports.up = function (knex) {
  return knex.schema.createTable("remedials", (table) => {
    table.increments("id").primary();
    table
      .integer("job_id")
      .unsigned()
      .references("id")
      .inTable("jobs")
      .onDelete("CASCADE");
    table
      .integer("fitter_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.text("description").notNullable();
    table.string("status").notNullable();
    table.text("notes").nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("remedials");
};
