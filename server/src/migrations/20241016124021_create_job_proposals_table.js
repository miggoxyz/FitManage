exports.up = function (knex) {
  return knex.schema.createTable("job_proposals", (table) => {
    table.increments("id").primary();
    table
      .integer("job_id")
      .unsigned()
      .references("id")
      .inTable("jobs")
      .onDelete("CASCADE");
    table.string("proposed_by").notNullable();
    table.date("start_date").notNullable();
    table.date("end_date").notNullable();
    table.string("status").notNullable();
    table.text("feedback").nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("job_proposals");
};
