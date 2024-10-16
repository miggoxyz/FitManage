const knex = require("knex");
const knexConfig = require("../../knexfile");

const db = knex(knexConfig.development);

// Create a new customer
const createCustomer = async (req, res) => {
  const { name, address, contact_details } = req.body;
  try {
    // Insert the customer and get the id of the new record
    const [id] = await db("customers")
      .insert({ name, address, contact_details })
      .returning("id");

    res.status(201).json({ message: "Customer created successfully", id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all customers
const getCustomers = async (req, res) => {
  try {
    const customers = await db("customers").select("*");
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a customer by ID
const getCustomerById = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await db("customers").where({ id }).first();
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a customer
const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, address, contact_details } = req.body;
  try {
    const rowsAffected = await db("customers")
      .where({ id })
      .update({ name, address, contact_details });
    if (rowsAffected === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a customer
const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const rowsAffected = await db("customers").where({ id }).del();
    if (rowsAffected === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
