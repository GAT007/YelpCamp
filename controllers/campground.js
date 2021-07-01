const Campground = require("../models/campground");

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.new = async (req, res, next) => {
    res.render("campgrounds/new");
};

module.exports.makeNew = async (req, res, next) => {
    //if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    //console.log("Request body");
    //console.log(req.body);
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    //console.log("New Campground created");
    console.log(newCampground);
    await newCampground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.showById = async (req, res, next) => {
    const { id } = req.params;
    const campground = await (await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        },
    }).populate("author"));
    console.log(campground);
    if (!campground) {
        req.flash("error", "No campground found with that id!");
        res.redirect("/campgrounds");
    }
    //console.log(campground);
    res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    if (!foundCampground) {
        req.flash("error", "No campground found with that id!");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { foundCampground });
};

module.exports.edit = async (req, res, next) => {
    const { id } = req.params;
    let foundCampground = await Campground.findById(id);
    if (!foundCampground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    const updatedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    console.log(updatedCampground);
    req.flash("success", "Successfully edited the campground!");
    res.redirect(`/campgrounds/${id}`);
}

module.exports.delete = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!");
    res.redirect("/campgrounds");
};