const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviewController.js");

// Reviews ------------------------->
// Post Route------>
router.post("/",
    validateReview,
    isLoggedIn,
    wrapAsync(reviewController.createReview));


// Delete Route -------->
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview));


module.exports = router;