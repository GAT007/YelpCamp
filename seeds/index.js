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
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 100);
    const camp = new Campground({
      author: "60dd5d5e6efe64139c557c55",
      geometry: { coordinates: [cities[random1000].longitude, cities[random1000].latitude], type: 'Point' },
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: [
        {
          url: 'https://res.cloudinary.com/atallankiyelpcamp/image/upload/v1625378619/YelpCamp/ybw7ehzuogrlhewk03zl.jpg',
          filename: 'YelpCamp/ybw7ehzuogrlhewk03zl'
        },
        {
          url: 'https://res.cloudinary.com/atallankiyelpcamp/image/upload/v1625378764/YelpCamp/szhlogsmapbxhdpvpi49.jpg',
          filename: 'YelpCamp/szhlogsmapbxhdpvpi49'
        }

      ],
      description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perspiciatis qui ratione sequi excepturi odio voluptas distinctio dolores modi aliquid saepe aut et rem, necessitatibus veritatis iusto culpa unde similique iure.",
      price
    });
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});

