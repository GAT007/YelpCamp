const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const { vCampgroundSchema } = require("../vSchemas/vCampground");

const validateCampground = (req, res, next) => {

    const { error } = vCampgroundSchema.validate(req.body.campground);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, "500");
    }
    else {
        next();
    }
    //console.log(res);
}

router.get('/', wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get("/new", wrapAsync(async (req, res, next) => {
    res.render("campgrounds/new");
}));

router.post("/makeNew", validateCampground, wrapAsync(async (req, res, next) => {
    //if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    //console.log("Request body");
    //console.log(req.body);
    const newCampground = new Campground(req.body.campground);
    //console.log("New Campground created");
    //console.log(newCampground);
    await newCampground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

router.get('/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
        req.flash("error", "No campground found with that id!");
        res.redirect("/campgrounds");
    }
    //console.log(campground);
    res.render('campgrounds/show', { campground });
}));

router.get("/:id/edit", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    if (!foundCampground) {
        req.flash("error", "No campground found with that id!");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { foundCampground });
}));

router.put("/:id", validateCampground, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body.campground);
    const updatedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    req.flash("success", "Successfully edited the campground!");
    res.redirect(`/campgrounds/${id}`);
}));

router.delete("/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!");
    res.redirect("/campgrounds");
}));

module.exports = router;