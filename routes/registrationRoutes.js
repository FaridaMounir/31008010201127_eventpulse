const express = require("express");
const router = express.Router();
const {eventRegister, getUserRegister, cancelRegister} = require("../controllers/registrationController");
const { requireAuth } = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const validate = require("../middleware/validate");

router.use(requireAuth);

/**
 * @openapi
 * /api/registrations:
 *   post:
 *     summary: Register the current user for an event
 *     tags: [Registrations]
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
 *             properties:
 *               eventId:
 *                 type: string
 *                 description: Valid Mongo ID of the target event
 *     responses:
 *       201:
 *         description: Successfully registered for the event
 *       400:
 *         description: Event full or duplicate registration detected
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Invalid event ID format
 */
router.post("/",
  [body("eventId").isMongoId().withMessage("Incorrect Id"), validate],
  eventRegister
);

/**
 * @openapi
 * /api/registrations/myEvents:
 *   get:
 *     summary: Get all events registered by the current user
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user registrations with event details
 *       401:
 *         description: Unauthorized
 */
router.get("/myEvents", getUserRegister);

/**
 * @openapi
 * /api/registrations/{id}:
 *   delete:
 *     summary: Cancel a registration and free up a spot
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration Mongo ID
 *     responses:
 *       200:
 *         description: Registration cancelled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Cannot cancel a registration belonging to another user
 *       404:
 *         description: Registration not found
 */
router.delete("/:id", cancelRegister);

module.exports = router;