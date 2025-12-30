import db from "../db/index.js";

export const getMe = async (req, res) => {
  try {
    // req.user is set by the verifyToken middleware
    console.log("req is ", req);

    const userId = req.user.id;

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
