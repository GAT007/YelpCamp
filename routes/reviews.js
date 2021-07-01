const express = require("express");
const router = express.Router({ mergeParams: true });
const review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const Campground = require("../models/campground");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../utils/middleware");
const reviewController = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.addReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;