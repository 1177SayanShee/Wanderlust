const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listingController.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// Index Route  -------------------->
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing));
    

// Create Route --------------------->
router.get("/new",
    isLoggedIn,
    listingController.renderNewForm
);

// Search Route 
router.route("/search")
      .get( wrapAsync(listingController.searchListings));

// Filter Route
router.route("/search/:category")
      .get( wrapAsync(listingController.filterListings));


// Show Route  ---------------------->
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteListing));

// Edit Route  --------------------->
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.rendereditForm));




module.exports = router;