const express =require("express");
const router =express.Router();
const { body } = require("express-validator");
const {requireAuth, requireRole} =require("../middleware/authMiddleware");
const {getEvents,getById, createEvent, updateEvent, deleteEvent} =require("../controllers/eventController")
const validate =require("../middleware/validate");

router.get("/", getEvents);
router.get("/:id", getById);

router.post("/", requireAuth, requireRole("admin"), [
    body("title").notEmpty().withMessage("Title is required."),
    body("date").isISO8601().withMessage("Enter a valid date"),
    body("category").isMongoId().withMessage("Enter a valid Id"),
    body("capacity").isInt({gt: 0}).withMessage("Capacity must be a positive number."),
    validate
],createEvent);
router.patch("/:id", requireAuth, requireRole("admin"), [
    body("id").isMongoId().withMessage("Enter a valid Id."),
    body("title").optional().notEmpty().withMessage("Title is required."),
    body("date").optional().isISO8601().withMessage("Enter a valid date"),
    body("category").optional().isMongoId().withMessage("Enter a valid Id"),
    body("capacity").optional().isInt({gt: 0}).withMessage("Capacity must be a positive number."),
    validate
],updateEvent);
router.delete("/:id", requireAuth, requireRole("admin"), deleteEvent);


module.exports =router;