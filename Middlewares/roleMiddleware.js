const checkRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.userRole;

      if (!userRole || userRole.name !== requiredRole) {
        return res.status(403).json({
          status: false,
          message: "Access denied. You do not have the required role.",
        });
      }

      next(); // User has the required role, proceed to the next middleware or controller
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
};

module.exports = checkRole;