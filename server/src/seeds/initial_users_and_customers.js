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
        name: "Admin User 1",
        email: "admin1@example.com",
        password: hashedPassword,
        created_at: "2024-10-01 10:00:00",
        updated_at: "2024-10-01 10:00:00",
      },
      {
        id: 2,
        role: "admin",
        name: "Admin User 2",
        email: "admin2@example.com",
        password: hashedPassword,
        created_at: "2024-10-01 10:05:00",
        updated_at: "2024-10-01 10:05:00",
      },
      {
        id: 3,
        role: "fitter",
        name: "Fitter User 1",
        email: "fitter1@example.com",
        password: hashedPassword,
        created_at: "2024-10-02 10:00:00",
        updated_at: "2024-10-02 10:00:00",
      },
      {
        id: 4,
        role: "fitter",
        name: "Fitter User 2",
        email: "fitter2@example.com",
        password: hashedPassword,
        created_at: "2024-10-02 10:10:00",
        updated_at: "2024-10-02 10:10:00",
      },
      {
        id: 5,
        role: "fitter",
        name: "Fitter User 3",
        email: "fitter3@example.com",
        password: hashedPassword,
        created_at: "2024-10-02 10:20:00",
        updated_at: "2024-10-02 10:20:00",
      },
    ])
    .returning("id");

  // Insert customers
  const customerIds = await knex("customers")
    .insert([
      {
        id: 1,
        name: "Customer 1",
        address: "123 Main St",
        contact_details: "customer1@example.com",
        created_at: "2024-10-03 10:00:00",
        updated_at: "2024-10-03 10:00:00",
      },
      {
        id: 2,
        name: "Customer 2",
        address: "456 Oak St",
        contact_details: "customer2@example.com",
        created_at: "2024-10-03 10:05:00",
        updated_at: "2024-10-03 10:05:00",
      },
      {
        id: 3,
        name: "Customer 3",
        address: "789 Pine St",
        contact_details: "customer3@example.com",
        created_at: "2024-10-03 10:10:00",
        updated_at: "2024-10-03 10:10:00",
      },
      {
        id: 4,
        name: "Customer 4",
        address: "101 Maple St",
        contact_details: "customer4@example.com",
        created_at: "2024-10-03 10:15:00",
        updated_at: "2024-10-03 10:15:00",
      },
      {
        id: 5,
        name: "Customer 5",
        address: "202 Birch St",
        contact_details: "customer5@example.com",
        created_at: "2024-10-03 10:20:00",
        updated_at: "2024-10-03 10:20:00",
      },
    ])
    .returning("id");

  // Insert jobs
  const jobIds = await knex("jobs")
    .insert([
      {
        id: 1,
        customer_id: 1,
        fitter_id: 3,
        status: "assigned",
        start_date: "2024-10-20",
        end_date: "2024-10-22",
        created_at: "2024-10-04 10:00:00",
        updated_at: "2024-10-04 10:00:00",
      },
      {
        id: 2,
        customer_id: 2,
        fitter_id: 4,
        status: "assigned",
        start_date: "2024-10-25",
        end_date: "2024-10-28",
        created_at: "2024-10-04 10:05:00",
        updated_at: "2024-10-04 10:05:00",
      },
      {
        id: 3,
        customer_id: 3,
        fitter_id: 5,
        status: "unassigned",
        start_date: null,
        end_date: null,
        created_at: "2024-10-04 10:10:00",
        updated_at: "2024-10-04 10:10:00",
      },
      {
        id: 4,
        customer_id: 4,
        fitter_id: 3,
        status: "remedial_pending",
        start_date: "2024-10-15",
        end_date: "2024-10-18",
        created_at: "2024-10-04 10:15:00",
        updated_at: "2024-10-04 10:15:00",
      },
      {
        id: 5,
        customer_id: 5,
        fitter_id: 4,
        status: "finished",
        start_date: "2024-10-10",
        end_date: "2024-10-12",
        created_at: "2024-10-04 10:20:00",
        updated_at: "2024-10-04 10:20:00",
      },
    ])
    .returning("id");

  // Insert job proposals
  await knex("job_proposals").insert([
    {
      id: 1,
      job_id: 1,
      proposed_by: "fitter",
      start_date: "2024-10-20",
      end_date: "2024-10-22",
      status: "pending",
      feedback: null,
      created_at: "2024-10-05 10:00:00",
      updated_at: "2024-10-05 10:00:00",
    },
    {
      id: 2,
      job_id: 2,
      proposed_by: "fitter",
      start_date: "2024-10-25",
      end_date: "2024-10-28",
      status: "accepted",
      feedback: null,
      created_at: "2024-10-05 10:05:00",
      updated_at: "2024-10-05 10:05:00",
    },
  ]);

  // Insert remedials
  await knex("remedials").insert([
    {
      id: 1,
      job_id: 4,
      fitter_id: 3,
      description: "Fix a minor issue",
      status: "pending",
      notes: null,
      created_at: "2024-10-06 10:00:00",
      updated_at: "2024-10-06 10:00:00",
    },
    {
      id: 2,
      job_id: 4,
      fitter_id: 3,
      description: "Check for leaks",
      status: "completed",
      notes: "No leaks found",
      created_at: "2024-10-06 10:05:00",
      updated_at: "2024-10-06 10:05:00",
    },
  ]);

  // Insert notifications
  await knex("notifications").insert([
    {
      id: 1,
      job_id: 1,
      user_id: 3,
      message: "You have been assigned a new job",
      type: "job_assignment",
      status: "pending",
      created_at: "2024-10-07 10:00:00",
      updated_at: "2024-10-07 10:00:00",
    },
    {
      id: 2,
      job_id: 2,
      user_id: 4,
      message: "Your date proposal was accepted",
      type: "date_proposal",
      status: "sent",
      created_at: "2024-10-07 10:05:00",
      updated_at: "2024-10-07 10:05:00",
    },
  ]);
};
