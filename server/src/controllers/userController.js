const knex = require("knex");
const knexConfig = require("../../knexfile");

const db = knex(knexConfig.development);

const getUsersByRole = async (req, res) => {
  const { role } = req.query;
  try {
    const users = await db("users")
      .where({ role })
      .select("id", "name", "email", "role");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users by role:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUsersByRole,
};
