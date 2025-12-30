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

// --- ADMIN FUNCTIONS ---

// 1. Get All Users with Pagination
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const usersQuery = await db.query(
      "SELECT id, full_name, email, role, status, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const countQuery = await db.query("SELECT COUNT(*) FROM users");
    const totalUsers = parseInt(countQuery.rows[0].count);

    res.json({
      users: usersQuery.rows,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Error in getAllUsers:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// 2. Update User Status (Activate/Deactivate)
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active' or 'inactive'

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const result = await db.query(
      "UPDATE users SET status = $1 WHERE id = $2 RETURNING id, full_name, email, status",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: `User ${status} successfully`, user: result.rows[0] });
  } catch (err) {
    console.error("Error in updateUserStatus:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
