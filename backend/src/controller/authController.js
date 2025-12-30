import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./../db/index.js";

// Helper: Email Validation Regex
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const signup = async (req, res) => {
  console.log("trying to sign up");

  console.log("printng db", db);

  console.log(db);
  const { full_name, email, password } = req.body;

  console.log(req.body);
  console.log("password is ", password);
  console.log("password type is ", typeof password);

  // 1. Validation [cite: 37, 38]
  if (!full_name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    // 2. Check if user exists
    console.log("inside try");
    console.log("prining type of email", typeof email);

    const rows = await db.query("SELECT * FROM users");
    console.log("printing rows", rows);

    const userExist = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    console.log("logging db rows");

    console.log(db.rows);

    console.log(userExist);

    console.log("logging userrows");

    console.log(userExist.rows);

    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // 3. Hash Password [cite: 53]
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Insert User
    const newUser = await db.query(
      "INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email, role",
      [full_name, email, hashedPassword]
    );
    console.log("user added", newUser);

    // 5. Generate Token [cite: 39]
    const token = jwt.sign(
      { id: newUser.rows[0].id, role: newUser.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (err) {
    console.log("Error signing up", err);

    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find User
    const userQuery = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const user = userQuery.rows[0];

    // 2. Verify Password [cite: 41]
    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // 3. Check Status (Active/Inactive)
    if (user.status !== "active") {
      return res
        .status(403)
        .json({ error: "Account is deactivated. Contact admin." });
    }

    // 4. Update Last Login [cite: 123]
    await db.query("UPDATE users SET last_login = NOW() WHERE id = $1", [
      user.id,
    ]);

    // 5. Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
