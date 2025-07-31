const checkPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      const userPermissions = req.user.userRole.permissions.map(
        (p) => p.permission.name
      );

      const hasPermission = requiredPermissions.some((p) =>
        userPermissions.includes(p)
      );

      if (!hasPermission) {
        return res.status(403).json({
          status: false,
          message: "Access denied. You do not have the required permissions.",
        });
      }

      next(); // User has the required permissions, proceed to the next middleware or controller
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
};

module.exports = checkPermissions;