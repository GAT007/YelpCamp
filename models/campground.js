const mongoose = require('mongoose');
const mongooseSchema = mongoose.Schema;
const Review = require("./review")

const CampgroundSchema = new mongooseSchema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
    author: {
        type: mongooseSchema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: mongooseSchema.Types.ObjectId,
        ref: 'Review'
    }
    ]
});

CampgroundSchema.post("findOneAndDelete", async function (campground) {
    if (campground.reviews.length) {
        let res = await Review.deleteMany({ _id: { $in: campground.reviews } })
        console.log(res);
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);