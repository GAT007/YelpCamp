const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../utils/middleware");
const campgrounds = require("../controllers/campground")

router.get('/', wrapAsync(campgrounds.index));

router.get("/new", isLoggedIn, wrapAsync(campgrounds.new));

router.post("/makeNew", isLoggedIn, validateCampground, wrapAsync(campgrounds.makeNew));

router.route("/:id")
    .get(wrapAsync(campgrounds.showById))
    .put(isLoggedIn, isAuthor, validateCampground, wrapAsync(campgrounds.edit))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.delete));


router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));


module.exports = router;