const Joi = require("joi");


// Listing Schema
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        country : Joi.string().required(),
        location : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.string().allow("", null),
        categories: Joi.array()
            .items(Joi.string().valid("Room", "Pool", "Farm", "Mountain", "City", "Camping", "Castle", "Boat", "Arctic", "Dome"))
            .min(1) // Ensures at least one category is selected
            .required()
        
    }).required()
});


// Review Schema
module.exports.reviewSchema = Joi.object({
        review : Joi.object({
            comment : Joi.string().required(),
            rating : Joi.number().min(1).max(5).required()
        }).required()
});