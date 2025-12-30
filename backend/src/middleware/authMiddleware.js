import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  console.log("\t\t\tin  middleware");

  // Check for token in "Authorization: Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access Denied: No Token Provided" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user info (id, role) to request
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid Token" });
  }
};

export default verifyToken;
