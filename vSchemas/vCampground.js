const joi = require("joi");
module.exports.vCampgroundSchema = joi.object({
    title: joi.string().required(),
    price: joi.number().required().min(0),
    image: joi.string().required(),
    description: joi.string().required(),
    location: joi.string().required()
});

module.exports.vReviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(0).max(5),
        body: joi.string().required(),
    }).required()
})