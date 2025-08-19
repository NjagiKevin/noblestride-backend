// Middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const db = require("../Models");

const authMiddleware = async (req, res, next) => {
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

    req.user = user;
    next();
  } catch (ex) {
    res.status(400).json({ status: "false", message: "Invalid token." });
  }
};

module.exports = authMiddleware;
