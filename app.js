const express = require('express');
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync");
const Campground = require("./models/campground");
const ExpressError = require("./utils/ExpressError");
const { vCampgroundSchema, vReviewSchema } = require("./vSchemas/vCampground");
const morgan = require("morgan");
const review = require("./models/review");

mongoose
    .connect("mongodb://localhost:27017/yelp-camp", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("Mongo Connection open!");
    })
    .catch((err) => {
        console.log("Oh no mongo error!!!");
        console.log(err);
    });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan('tiny'));

const validateCampground = (req, res, next) => {

    const { error } = vCampgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, "500");
    }
    else {
        next();
    }
    //console.log(res);
}

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

app.get("/", (req, res) => {
    res.render("home");
})

app.get('/campgrounds', wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

app.get("/campgrounds/new", wrapAsync(async (req, res, next) => {
    res.render("campgrounds/new");
}));

app.post("/campgrounds/makeNew", validateCampground, wrapAsync(async (req, res, next) => {
    //if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const newCampground = new Campground(req.body);
    await newCampground.save();
    res.redirect("/campgrounds");
}));

app.get('/campgrounds/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    //console.log(campground);
    res.render('campgrounds/show', { campground });
}));



app.get("/campgrounds/:id/edit", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    res.render("campgrounds/edit", { foundCampground });
}));

app.post("/campgrounds/:id/reviews", validateReview, wrapAsync(async (req, res, next) => {
    let campground = await Campground.findById(req.params.id);
    let newReview = new review(req.body.review);
    campground.reviews.push(newReview);
    await campground.save();
    await newReview.save();
    res.redirect(`/campgrounds/${campground._id}`);

}));

app.put("/campgrounds/:id", validateCampground, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body.campground);
    const updatedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    res.redirect(`/campgrounds/${id}`);
}));



app.delete("/campgrounds/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));

app.delete("/campground/:id/review/:reviewId", wrapAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { err });
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})