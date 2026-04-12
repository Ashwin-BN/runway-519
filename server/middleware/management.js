export const isManagement = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "management") {
    return res.status(403).json({ error: "Management access required" });
  }

  next();
};