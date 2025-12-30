const isAdmin = (req, res, next) => {
  console.log("printing request ", req);

  console.log("in admin middle");

  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access Denied: Admins only" });
  }
};

export default isAdmin;
