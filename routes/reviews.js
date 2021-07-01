const express = require("express");
const router = express.Router({ mergeParams: true });
const review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const Campground = require("../models/campground");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../utils/middleware");

router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res, next) => {
    let campground = await Campground.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await campground.save();
    await newReview.save();
    req.flash("success", "Successfully added a review");
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "Successfully deleted the review");
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;