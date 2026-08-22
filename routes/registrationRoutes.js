const express =require("express");
const router= express.Router();
const {eventRegister, getUserRegister, cancelRegister} =require("../controllers/registrationController");
const {requireAuth} =require("../middleware/authMiddleware");
const {body} =require("express-validator");
const validate =require("../middleware/validate");

router.use(requireAuth);

router.post("/", [
    body("eventId").isMongoId().withMessage("Incorrect Id"),
    validate
],eventRegister);
router.get("/myEvents", getUserRegister);
router.delete("/:id", cancelRegister);

module.exports =router;