const express = require("express");
const router = express.Router();
const {announcementCreate, getById} = require("../controllers/annoucementController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

/**
 * @openapi
 * /api/announcements/{eventId}:
 *   get:
 *     summary: Retrieve announcement message history for a specific event
 *     tags: [Announcements]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Mongo ID of the event
 *     responses:
 *       200:
 *         description: List of announcements ordered by time
 *       404:
 *         description: Event not found
 */
router.get("/:eventId", getById);

/**
 * @openapi
 * /api/announcements:
 *   post:
 *     summary: Broadcast a live announcement to an event room and store it (Admin only)
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - message
 *             properties:
 *               eventId:
 *                 type: string
 *                 description: Target event Mongo ID
 *               message:
 *                 type: string
 *                 description: Announcement content
 *     responses:
 *       201:
 *         description: Announcement broadcasted and saved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 *       422:
 *         description: Missing required fields
 */
router.post("/", requireAuth, requireRole("admin"), announcementCreate);

module.exports = router;