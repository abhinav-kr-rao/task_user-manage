import db from "../db/index.js";

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log("id ", userId);

    const result = await db.query(
      "SELECT id, full_name, email, role, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error in getMe:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, email } = req.body;

    // Basic validation
    if (!full_name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const result = await db.query(
      "UPDATE users SET full_name = $1, email = $2 WHERE id = $3 RETURNING id, full_name, email, role",
      [full_name, email, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error in updateMe:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
