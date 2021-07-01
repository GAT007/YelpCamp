const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const auth = require("../controllers/auth");

router.route("/register")
    .get(auth.renderRegister)
    .post(wrapAsync(auth.register));

router.route("/login")
    .get(auth.renderLogin)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), auth.login);

router.get("/logout", auth.logout)

module.exports = router;