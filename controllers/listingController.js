const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });


module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.locals.allListings = allListings;
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
    const { location, country } = req.body.listing;

    const response = await geocodingClient.forwardGeocode({
        query: `${location}, ${country}`,
        limit: 1
    })
        .send()

    // console.log(response.body.features[0].geometry);
    // return res.send("done");

    //    const {title, descrption, price, location, country} = req.body;

    const url = req.file.path;
    const filename = req.file.filename;

    // console.log(url, ".. ", filename);

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;

    let result = await newListing.save();
    console.log(result);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");

};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "author"
        }
    }).populate("owner");

    // console.log(listing.reviews);
    // console.log(req.user);
    if (!listing) {
        req.flash("error", "Listing Does Not Exist!!");
        res.redirect("/listings");
    }

    // console.log(res.locals);
    res.render("listings/show.ejs", { listing });
};

module.exports.rendereditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing Does Not Exist!!");
        res.redirect("/listings");
    }

    const originalImageUrl = listing.image.url;

    let previewImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing, previewImageUrl });
};

module.exports.updateListing = async (req, res) => {

    const { id } = req.params;
    // const url = req.file.path;
    // const filename  = req.file.filename;

    // const listing = await Listing.findByIdAndUpdate(id, req.body.listing);

    // if(typeof req.file !== "undefined"){
    //     listing.image.url = url;
    //     listing.image.filename = filename;
    //     await listing.save();
    // }


    // Better Approach(Update the listing all at once)
    const updateData = req.body.listing;

    if (req.file) {
        updateData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await Listing.findByIdAndUpdate(id, { $set: updateData });
    req.flash("success", "Listing Edited!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success", "Listing Deleted!");
    return res.redirect("/listings");
};

module.exports.searchListings = async (req, res) => {
        
        const { location } = req.query;
        
        if (!location) {
            return res.redirect("/listings");
        }

        const allListings = await Listing.find({ location });

        if (!allListings.length) {
            req.flash("error", "No Listings Found!");
            return res.redirect("/listings");

        }

        res.locals.location = location;
        res.render("listings/index.ejs", { allListings });


};