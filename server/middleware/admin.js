export const isManagementOrAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "management") {
    return res.status(403).json({ error: "Management or Admin access required" });
  }

  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
};