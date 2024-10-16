const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const jobRoutes = require("./routes/jobRoutes");

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/jobs", jobRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Kitchen Fitter Management API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
