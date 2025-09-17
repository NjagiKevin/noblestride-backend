const db = require("../Models");
const ApiKey = db.api_keys;
const { v4: uuidv4 } = require("uuid");

const createApiKey = async (req, res) => {
  try {
    const userId = req.user.id;
    const key = uuidv4();

    const apiKey = await ApiKey.create({
      key,
      user_id: userId,
    });

    res.status(201).json({ status: true, apiKey });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getUserApiKeys = async (req, res) => {
  try {
    const userId = req.user.id;

    const apiKeys = await ApiKey.findAll({ where: { user_id: userId } });

    res.status(200).json({ status: true, apiKeys });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const deleteApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const apiKey = await ApiKey.findOne({ where: { id, user_id: userId } });

    if (!apiKey) {
      return res.status(404).json({ status: false, message: "API key not found." });
    }

    await apiKey.destroy();

    res.status(200).json({ status: true, message: "API key deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const toggleApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const apiKey = await ApiKey.findOne({ where: { id, user_id: userId } });

    if (!apiKey) {
      return res.status(404).json({ status: false, message: "API key not found." });
    }

    apiKey.is_active = !apiKey.is_active;
    await apiKey.save();

    res.status(200).json({ status: true, apiKey });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createApiKey,
  getUserApiKeys,
  deleteApiKey,
  toggleApiKey,
};