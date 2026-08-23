const express = require("express");
const router = express.Router();
const { param, body } = require("express-validator");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {getEvents, getById, createEvent, updateEvent, deleteEvent} = require("../controllers/eventController");
const validate = require("../middleware/validate");

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @openapi
 * /api/events:
 *   get:
 *     summary: Get all events (supports filtering, pagination, sorting, and search)
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID or name to filter by
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: City to filter by
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Text search across name and description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., date or registrations)
 *     responses:
 *       200:
 *         description: Successfully retrieved list of events
 */
router.get("/", getEvents);

/**
 * @openapi
 * /api/events/{id}:
 *   get:
 *     summary: Get a single event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event Mongo ID
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */
router.get("/:id", getById);

/**
 * @openapi
 * /api/events:
 *   post:
 *     summary: Create a new event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *               - city
 *               - venue
 *               - category
 *               - capacity
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               city:
 *                 type: string
 *               venue:
 *                 type: string
 *               category:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Bad Request (Missing Mongoose fields)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       422:
 *         description: Validation error
 */
router.post("/", requireAuth, requireRole("admin"),[
    body("title").notEmpty().withMessage("Title is required."),
    body("description").notEmpty().withMessage("Description is required."),
    body("date").isISO8601().withMessage("Enter a valid date"),
    body("city").notEmpty().withMessage("City is required."),
    body("venue").notEmpty().withMessage("Venue is required."),
    body("category").isMongoId().withMessage("Enter a valid Id"),
    body("capacity").isInt({ gt: 0 }).withMessage("Capacity must be a positive number."), validate
  ],
  createEvent
);

/**
 * @openapi
 * /api/events/{id}:
 *   patch:
 *     summary: Update an existing event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               category:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 *       404:
 *         description: Event not found
 *       422:
 *         description: Validation error
 */
router.patch(
  "/:id",
  requireAuth,
  requireRole("admin"),
  [
    param("id").isMongoId().withMessage("Enter a valid Id."),
    body("title").optional().notEmpty().withMessage("Title is required."),
    body("date").optional().isISO8601().withMessage("Enter a valid date"),
    body("category").optional().isMongoId().withMessage("Enter a valid Id"),
    body("capacity")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("Capacity must be a positive number."),
    validate,
  ],
  updateEvent
);

/**
 * @openapi
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 *       404:
 *         description: Event not found
 */
router.delete("/:id", requireAuth, requireRole("admin"), deleteEvent);

module.exports = router;