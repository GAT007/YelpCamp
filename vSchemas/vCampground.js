const baseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
    type : 'string',
    base : joi.string(),
    messages : {
        'string.escapeHTML':'{{#label}} must not include HTML!'
    },
    rules : {
        escapeHTML  : {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags : [],
                    allowedAttributes : {},
                });
                if(clean!==value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
})

const joi = baseJoi.extend(extension);

module.exports.vCampgroundSchema = joi.object({
    title: joi.string().required().escapeHTML(),
    price: joi.number().required().min(0),
    description: joi.string().required().escapeHTML(),
    location: joi.string().required().escapeHTML()
});

module.exports.vReviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(0).max(5),
        body: joi.string().required().escapeHTML(),
    }).required()
});