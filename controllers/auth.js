const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
};

module.exports.register = async (req, res) => {
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
};

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo;
    if (redirectUrl) {
        delete req.session.returnTo;
        return res.redirect(redirectUrl);
    }
    res.redirect("/campgrounds");
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "You have been successfully logged out!");
    res.redirect("/campgrounds");
};