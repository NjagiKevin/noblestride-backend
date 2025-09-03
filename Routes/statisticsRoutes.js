const express = require("express");
const statisticsController = require("../Controllers/statisticsController");
const { getDashboardStatistics } = statisticsController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboardStatistics);

module.exports = router;