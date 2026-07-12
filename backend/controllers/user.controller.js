const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../services/jwt");
const { hashPassword, comparePassword } = require("../utils/password.util");
const { poolPromise } = require("../database/db_local");
const sql = require("mssql");

exports.signup = async (req, res) => {
  try {
    const { email, password, role, full_name } = req.body;

    if (!email || !password || !role || !full_name) {
      return res.status(400).json({
        message: "Email, password, role and full name are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const pool = await poolPromise;

    const existingUser = await pool
      .request()
      .input("email", normalizedEmail)
      .query("SELECT user_id FROM users WHERE email = @email");

    if (existingUser.recordset.length > 0) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const userResult = await pool
      .request()
      .input("email", normalizedEmail)
      .input("password", hashedPassword)
      .input("role", role)
      .input("full_name", full_name)
      .query(`
        INSERT INTO users (
          email,
          password,
          role,
          full_name
        )
        OUTPUT INSERTED.user_id
        VALUES (
          @email,
          @password,
          @role,
          @full_name
        )
      `);

    const userId = userResult.recordset[0].user_id;

    const token = jwt.sign(
      {
        id: userId,
        email: normalizedEmail,
        role,
        full_name,
      },
      secret,
      {
        expiresIn,
      }
    );

    return res.status(201).json({
      message: "User created successfully",
      user: {
        user_id: userId,
        email: normalizedEmail,
        role,
        full_name,
      },
      token,
    });

  } catch (err) {
    console.error("Signup error:", err);

    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("email", sql.NVarChar, normalizedEmail).query(`
        SELECT user_id, email, password, role, full_name
        FROM users
        WHERE email = @email
      `);

    if (!result.recordset.length) {
      return res.status(401).json({ message: "Invalid Email" });
    }

    const user = result.recordset[0];

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
      secret,
      { expiresIn },
    );

    res.json({
      user: {
        created_by: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
      token,
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  res.json({ message: "Reset link sent (mock)" });
};
