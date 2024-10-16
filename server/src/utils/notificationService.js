const knex = require("knex");
const knexConfig = require("../../knexfile");
const db = knex(knexConfig.development);

const createNotification = async (jobId, userId, message, type) => {
  try {
    await db("notifications").insert({
      job_id: jobId,
      user_id: userId,
      message,
      type,
      status: "pending",
    });
    console.log("Notification created successfully");
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};

module.exports = { createNotification };
