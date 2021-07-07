const mongoose = require('mongoose');
const mongooseSchema = mongoose.Schema;
const Review = require("./review");

const ImageSchema = new mongooseSchema({
    url: String,
    filename: String
});

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
})

const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new mongooseSchema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    image: [ImageSchema],
    author: {
        type: mongooseSchema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: mongooseSchema.Types.ObjectId,
        ref: 'Review'
    }
    ]
}, opts);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
    const hrefValue = `/campgrounds/${this.id}`;
    const title = `<a href=${hrefValue}><h5>${this.title}</h5></a>`;
    return title;
})

CampgroundSchema.post("findOneAndDelete", async function (campground) {
    if (campground.reviews.length) {
        let res = await Review.deleteMany({ _id: { $in: campground.reviews } })
        //console.log(res);
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);