const Campground = require("../models/campground");
const review = require("../models/review");


module.exports.addReview = async (req, res, next) => {
    let campground = await Campground.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await campground.save();
    await newReview.save();
    req.flash("success", "Successfully added a review");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "Successfully deleted the review");
    res.redirect(`/campgrounds/${id}`);
};