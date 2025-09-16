// Routes/notificationRoutes.js
const express = require("express");
const notificationController = require("../Controllers/notificationController");
const { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } = notificationController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getUserNotifications);
router.put("/:id/read", authMiddleware, markNotificationAsRead);
router.put("/read-all", authMiddleware, markAllNotificationsAsRead);

module.exports = router;