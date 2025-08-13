// Middlewares/adminAuthMiddleware.js
const jwt = require("jsonwebtoken");
const db = require("../Models");

const adminAuthMiddleware = async (req, res, next) => {
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
          as: "userRole",
          include: [
            {
              model: db.role_permissions,
              as: "permissions",
              include: [
                {
                  model: db.permissions,
                  as: "permission",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ status: "false", message: "User not found." });
    }

    // Check if user has admin role or admin permissions
    const hasAdminAccess = user.userRole?.permissions?.some(
      permission => permission.permission.name === 'ADMIN_ACCESS'
    );

    if (!hasAdminAccess) {
      return res.status(403).json({
        status: "false",
        message: "Access denied. Admin privileges required."
      });
    }

    req.user = user;
    next();
  } catch (ex) {
    res.status(400).json({ status: "false", message: "Invalid token." });
  }
};

module.exports = adminAuthMiddleware;
