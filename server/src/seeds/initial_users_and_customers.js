const bcrypt = require("bcrypt");

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("notifications").del();
  await knex("remedials").del();
  await knex("job_proposals").del();
  await knex("jobs").del();
  await knex("customers").del();
  await knex("users").del();

  // Hash passwords for users
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Insert users (admins and fitters)
  const userIds = await knex("users")
    .insert([
      {
        id: 1,
        role: "admin",
        name: "Mo",
        email: "mo@example.com",
        password: hashedPassword,
        created_at: "2024-10-01 10:00:00",
        updated_at: "2024-10-01 10:00:00",
      },
      {
        id: 2,
        role: "fitter",
        name: "Andi",
        email: "andi@example.com",
        password: hashedPassword,
        created_at: "2024-10-02 10:20:00",
        updated_at: "2024-10-02 10:20:00",
      },
    ])
    .returning("id");
};
