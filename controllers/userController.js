const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
    const { username, email, password } = req.body;

    const newUser = new User({
        username: username,
        email: email
    });

    try {
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) next(err);

            req.flash("success", "Welcome to Wanderlust!");
            return res.redirect("/listings");

        })

    }
    catch (err) {
        req.flash("error", "Username already Exist!!");
        res.redirect("/signup");
    }

};

module.exports.renderLogInForm = (req, res) => {

    res.render("users/login.ejs");
};

module.exports.logIn = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");

    if (res.locals.redirectUrl) {
        return res.redirect(res.locals.redirectUrl);
    }
    res.redirect("/listings");
};

module.exports.logOut = async (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are successfully Logged Out!!");
        res.redirect("/listings");
    });
};