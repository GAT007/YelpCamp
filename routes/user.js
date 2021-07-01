const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

router.get("/register", (req, res) => {
    res.render("users/register");
})

router.post("/register", wrapAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
        });
        req.flash("success", `Welcome to Yelp Camp ${username}`);
        res.redirect("/campgrounds");
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("register");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login");
})

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), async (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo;
    if (redirectUrl) {
        delete req.session.returnTo;
        return res.redirect(redirectUrl);
    }
    res.redirect("/campgrounds");
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You have been successfully logged out!");
    res.redirect("/campgrounds");
})

module.exports = router;