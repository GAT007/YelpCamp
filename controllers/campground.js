const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.new = async (req, res, next) => {
    res.render("campgrounds/new");
};

module.exports.makeNew = async (req, res, next) => {
    // console.log("Request body");
    // console.log(req.body);
    // console.log("Request files");
    // console.log(req.files);
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    //console.log(geoData);
    const newCampground = new Campground(req.body.campground);
    newCampground.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCampground.author = req.user._id;
    newCampground.geometry = geoData.body.features[0].geometry;
    //console.log("New Campground created");
    //console.log(newCampground);
    const savedCampground = await newCampground.save();
    console.log(savedCampground);
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
    //console.log(campground);
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
    //console.log(foundCampground);
    if (!foundCampground) {
        req.flash("error", "No campground found with that id!");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { foundCampground });
};

module.exports.edit = async (req, res, next) => {
    const { id } = req.params;
    //console.log(req.body.deleteImages);
    let foundCampground = await Campground.findById(id);
    if (!foundCampground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    const updatedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    updatedCampground.image.push(...imgs);
    updatedCampground.author = req.user._id;
    await updatedCampground.save();
    if (req.body.deleteImages) {
        //console.log("Now deleting images");
        const updatedCampgroundv2 = await updatedCampground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } });
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        //console.log(updatedCampgroundv2);
    }
    //console.log(updatedCampground);
    req.flash("success", "Successfully edited the campground!");
    res.redirect(`/campgrounds/${id}`);
}

module.exports.delete = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!");
    res.redirect("/campgrounds");
};