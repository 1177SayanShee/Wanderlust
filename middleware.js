const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a New Listing!");
        return res.redirect("/login");     // It is recommended to use 'return' keyword to avoid any unnecessary excution of code after res.redirect()
    }

    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the Owner of this Listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

// Validation For Listing Schema (Using Joi)
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        // let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }

    next();
}

// Validation For Review Schema (Using Joi)
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        // let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }

    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId,id } = req.params;

    const review = await Review.findById(reviewId);

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the Author of this Review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
}