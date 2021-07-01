const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require('./seedHelpers');
const Campground = require("../models/campground");
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
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 100);
    const camp = new Campground({
      author: "60dd5d5e6efe64139c557c55",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perspiciatis qui ratione sequi excepturi odio voluptas distinctio dolores modi aliquid saepe aut et rem, necessitatibus veritatis iusto culpa unde similique iure.",
      price
    });
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});

