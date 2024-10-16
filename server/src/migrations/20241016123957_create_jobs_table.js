exports.up = function (knex) {
  return knex.schema.createTable("jobs", (table) => {
    table.increments("id").primary();
    table
      .integer("customer_id")
      .unsigned()
      .references("id")
      .inTable("customers")
      .onDelete("CASCADE");
    table
      .integer("fitter_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.string("status").notNullable();
    table.date("start_date").nullable();
    table.date("end_date").nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("jobs");
};
