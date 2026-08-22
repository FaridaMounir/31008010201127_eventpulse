const express =require("express");
const router =express.Router();
const {register, login} =require("../controllers/authController");
const {body} =require("express-validator");
const validate =require("../middleware/validate");

router.post("/register",[
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Please provide a correct email."),
    body("password").isLength({min: 6}).withMessage("Password must be atleast 6 characters."),
    validate
] ,register);
router.post("/login",
    [
        body("email").isEmail().withMessage("Please provide a valid Email."),
        body("password").notEmpty().withMessage("Password is required."),
        validate
    ] ,login);


module.exports =router;