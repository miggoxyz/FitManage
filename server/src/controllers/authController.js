const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const knex = require("knex");
const knexConfig = require("../../knexfile");
const { sendVerificationCode } = require("../utils/notificationService");

const db = knex(knexConfig.development);

// Register User Function
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

    // Send verification code to the user's phone number using Twilio
    await sendVerificationCode(phoneNumber, verificationCode);

    // Insert user data into the database
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

// Login User Function
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

    // Generate token with isVerified flag
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        name: user.name,
        isVerified: user.is_mobile_verified,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify Code Function
const verifyCode = async (req, res) => {
  const { verificationCode } = req.body;
  const userId = req.user.id;

  try {
    const user = await db("users")
      .where({
        id: userId,
        mobile_verification_code: verificationCode,
      })
      .first();

    if (!user) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    await db("users").where({ id: userId }).update({
      is_mobile_verified: true,
      mobile_verification_code: null,
      verified_at: new Date(),
    });

    res.status(200).json({ message: "Phone number verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Resend Verification Code Function
const resendVerificationCode = async (req, res) => {
  const { userId } = req.user;
  const { phoneNumber } = req.body;

  try {
    const newVerificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Send the new verification code via Twilio
    await sendVerificationCode(phoneNumber, newVerificationCode);

    // Update the user's phone number and verification code in the database
    await db("users").where({ id: userId }).update({
      mobile_number: phoneNumber,
      mobile_verification_code: newVerificationCode,
      is_mobile_verified: false,
      verified_at: null,
    });

    res
      .status(200)
      .json({ message: "Verification code sent to the new phone number." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyCode,
  resendVerificationCode,
};
