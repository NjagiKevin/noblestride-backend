const db = require("../Models");
const ApiKey = db.api_keys;
const User = db.users;

const apiKeyAuthMiddleware = async (req, res, next) => {
  const apiKey = req.header("X-API-Key");

  if (!apiKey) {
    return next();
  }

  try {
    const key = await ApiKey.findOne({ where: { key: apiKey } });

    if (!key || !key.is_active) {
      return res.status(401).json({ status: false, message: "Invalid API key." });
    }

    const user = await User.findByPk(key.user_id);

    if (!user) {
      return res.status(401).json({ status: false, message: "Invalid API key." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = apiKeyAuthMiddleware;
