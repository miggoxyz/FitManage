const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const knex = require("knex");
const knexConfig = require("../../knexfile");
const { sendVerificationCode } = require("../utils/notificationService");

const db = knex(knexConfig.development);

const registerUser = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  try {
    const existingUser = await db("users").where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a random 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await sendVerificationCode(phoneNumber, verificationCode);

    await db("users").insert({
      name,
      email,
      password: hashedPassword,
      role: "fitter",
      mobile_number: phoneNumber,
      mobile_verification_code: verificationCode,
      is_mobile_verified: false,
    });

    res.status(201).json({
      message: "User registered successfully. Please verify your phone number.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.is_mobile_verified) {
      return res.status(403).json({ message: "Phone number not verified" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyCode = async (req, res) => {
  const { phoneNumber, verificationCode } = req.body;

  try {
    // Find the user by phone number and verification code
    const user = await db("users")
      .where({
        mobile_number: phoneNumber,
        mobile_verification_code: verificationCode,
      })
      .first();

    // If no user is found, return an error
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid verification code or phone number" });
    }

    // Update the user's verification status in the database
    await db("users").where({ id: user.id }).update({
      is_mobile_verified: true,
      mobile_verification_code: null, // Clear the code after successful verification
      verified_at: new Date(), // Set verification timestamp
    });

    res.status(200).json({ message: "Phone number verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, verifyCode };
