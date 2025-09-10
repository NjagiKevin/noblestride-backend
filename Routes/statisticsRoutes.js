const express = require("express");
const statisticsController = require("../Controllers/statisticsController");
const { getDashboardStatistics, getDealValuesByLead, getDealStatusCounts, getDealTypeDistribution, getSectorDistribution, getDealStatusDistribution } = statisticsController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboardStatistics);
router.get("/deal-values-by-lead", authMiddleware, getDealValuesByLead);
router.get("/deal-status-counts", authMiddleware, getDealStatusCounts);
router.get("/deal-type-distribution", authMiddleware, getDealTypeDistribution);
router.get("/sector-distribution", authMiddleware, getSectorDistribution);
router.get("/deal-status-distribution", authMiddleware, getDealStatusDistribution);

module.exports = router;