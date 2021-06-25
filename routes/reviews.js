const express = require("express");
const router = express.Router({ mergeParams: true });
const review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const { vReviewSchema } = require("../vSchemas/vCampground");

const validateReview = (req, res, next) => {
    const { error } = vReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, "500");
    }
    else {
        next();
    }
    //console.log(res);
}

router.post("/", validateReview, wrapAsync(async (req, res, next) => {
    let campground = await Campground.findById(req.params.id);
    let newReview = new review(req.body.review);
    campground.reviews.push(newReview);
    await campground.save();
    await newReview.save();
    req.flash("success", "Successfully added a review");
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:reviewId", wrapAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "Successfully deleted the review");
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;