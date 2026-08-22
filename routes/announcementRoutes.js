const express =require("express");
const router =express.Router();
const {announcementCreate, getById}=require("../controllers/annoucementController");
const {requireAuth, requireRole} =require("../middleware/authMiddleware");

router.get("/:eventId", getById);
router.post("/", requireAuth, requireRole("admin"), announcementCreate);

module.exports =router;