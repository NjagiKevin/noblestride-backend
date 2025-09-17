// Middlewares/adminRoleMiddleware.js
const jwt = require("jsonwebtoken");
const db = require("../Models");

const adminRoleMiddleware = async (req, res, next) => {
  if (req.user) {
    if (req.user.role !== "Administrator") {
      return res.status(403).json({
        status: "false",
        message: "Access denied. Administrator role required."
      });
    }
    return next();
  }

  const token =
    req.header("Authorization")?.replace("Bearer ", "") || req.cookies.jwt;
  
  if (!token) {
    return res
      .status(401)
      .json({ status: "false", message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.secretKey);
    const user = await db.users.findOne({
      where: { id: decoded.id },
      include: [
        {
          model: db.roles,
          as: "userRole"
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ status: "false", message: "User not found." });
    }

    // Check if user has Administrator role
    if (user.userRole?.name !== "Administrator") {
      return res.status(403).json({
        status: "false",
        message: "Access denied. Administrator role required."
      });
    }

    req.user = user;
    next();
  } catch (ex) {
    res.status(400).json({ status: "false", message: "Invalid token." });
  }
};

module.exports = adminRoleMiddleware;
