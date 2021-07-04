const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../utils/middleware");
const campgrounds = require("../controllers/campground");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });


router.get('/', wrapAsync(campgrounds.index));

router.get("/new", isLoggedIn, wrapAsync(campgrounds.new));

router.post("/makeNew", isLoggedIn, validateCampground, upload.array('campground[image]'), wrapAsync(campgrounds.makeNew));

//router.post("/makeNew", upload.single("campground[image]"), (req, res) => { res.send(req.body, req.file) });

router.route("/:id")
    .get(wrapAsync(campgrounds.showById))
    .put(isLoggedIn, isAuthor, upload.array("campground[image]"), validateCampground, wrapAsync(campgrounds.edit))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.delete));


router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));


module.exports = router;