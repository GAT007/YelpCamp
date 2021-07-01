const mongoose = require("mongoose");

const mongooseSchema = mongoose.Schema;

const reviewSchema = new mongooseSchema({
    body: String,
    rating: Number,
    author: {
        type: mongooseSchema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Review", reviewSchema);