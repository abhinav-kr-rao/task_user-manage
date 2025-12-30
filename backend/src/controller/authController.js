import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./../db/index.js";

// Helper: Email Validation Regex
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const signup = async (req, res) => {
  //   console.log("trying to sign up");

  //   console.log("printng db", db);

  //   console.log(db);
  const { full_name, email, password } = req.body;

  //   console.log(req.body);
  //   console.log("password is ", password);
  //   console.log("password type is ", typeof password);

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
    // Checking if user exists
    // console.log("inside try");
    // console.log("prining type of email", typeof email);

    const rows = await db.query("SELECT * FROM users");
    // console.log("printing rows", rows);

    const userExist = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // console.log("logging db rows");

    // console.log(db.rows);

    // console.log(userExist);

    // console.log("logging userrows");

    // console.log(userExist.rows);

    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Insert User
    const newUser = await db.query(
      "INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email, role",
      [full_name, email, hashedPassword]
    );
    // console.log("user added", newUser);

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
  //   console.log(req.body);

  const email = req.body.email;
  const password = req.body.password;

  //   console.log("printing email, password: ", email, " ", password);

  try {
    // console.log("email type", typeof email);

    // console.log(
    //   await db.query("SELECT * FROM users WHERE email = $1", [email])
    // );

    const userQuery = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // console.log(userQuery);
    const userRow = userQuery.rows;
    // console.log("printing a", userRow.length);

    if (userRow.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = userRow[0];
    // console.log("userrow[0]");
    // console.log(user);

    const stored_password = user.password_hash;

    // console.log("password is ", stored_password);

    //  Verify Password
    const validPass = await bcrypt.compare(password, stored_password);
    console.log(validPass);
    if (!validPass) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check Status (Active/Inactive)
    const user_Status = user.status;
    if (user_Status !== "active") {
      return res
        .status(403)
        .json({ error: "Account is deactivated. Contact admin." });
    }

    // Updating Last Login
    const userId = user.id;
    const userRole = user.role;
    // console.log("last login is", user.last_login.toLocaleString());

    // console.log("user id is", userId);

    // console.log(
    //   await db.query("UPDATE users SET last_login = NOW() WHERE id = $1", [
    //     userId,
    //   ])
    // );

    await db.query("UPDATE users SET last_login = NOW() WHERE id = $1", [
      userId,
    ]);

    const token = await jwt.sign(
      { id: userId, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // console.log("login success from backend");

    res.json({
      token,
      user: {
        id: userId,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    // console.log("error logging in ", err);

    res.status(500).json({ error: err.message });
  }
};
