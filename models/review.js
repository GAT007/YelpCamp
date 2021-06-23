const mongoose = require("mongoose");

const mongooseSchema = mongoose.Schema;

const reviewSchema = new mongooseSchema({
    body: String,
    rating: Number
})

module.exports = mongoose.model("Review", reviewSchema);