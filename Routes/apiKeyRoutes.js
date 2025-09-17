const express = require("express");
const apiKeyController = require("../Controllers/apiKeyController");
const {
  createApiKey,
  getUserApiKeys,
  deleteApiKey,
  toggleApiKey,
} = apiKeyController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/generate", authMiddleware, createApiKey);
router.get("/", authMiddleware, getUserApiKeys);
router.delete("/:id", authMiddleware, deleteApiKey);
router.put("/:id/toggle", authMiddleware, toggleApiKey);

module.exports = router;