const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
// const flash = require("connect-flash");

const passport = require("passport");

const userController = require("../controllers/userController.js");

router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signUp));


router.route("/login")
    .get(userController.renderLogInForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        userController.logIn
    );


router.get("/logout", wrapAsync(userController.logOut));

module.exports = router;