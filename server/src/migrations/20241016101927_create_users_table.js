exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("role").notNullable();
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table.string("mobile_number").unique();
    table.boolean("is_mobile_verified").defaultTo(false);
    table.string("mobile_verification_code");
    table.timestamp("verified_at");
    table.timestamps(true, true);

    table.index("email");
    table.index("mobile_number");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
