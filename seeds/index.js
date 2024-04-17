const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedhelper');
mongoose.connect('mongodb://localhost:27017/yelp-camp');
 // Import node-fetch

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const fetchData = async () => {
    try {
        const response = await fetch('https://api.unsplash.com/photos/random?client_id=BIlZIZScb1TVbINysd62yW-wobeWiqkb5iL5u5YdQls&collections=483251');
        const data = await response.json();
        return data.urls.small;  // Use 'small' instead of 'small_s3'
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
};

const seedDb = async () => {
     await Campground.deleteMany({});

    for (let i = 0; i < 30; i++) {
        //const imageUrl = await fetchData();
       // console.log(imageUrl);
        const randomnum = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const newcamp = new Campground({
            author:'65c748982400e3420414c783',
            location: `${cities[randomnum].city}, ${cities[randomnum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
           // Image: imageUrl , // Use imageUrl directly
            description: 'lorem ipsum dolor sit amet, consect lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit',
            price: price,
            Image: [
                {
                  url: 'https://res.cloudinary.com/dp34wlfqo/image/upload/v1709447912/YELLCAMP/q4lj2ezcqozsxgqyja4m.jpg',
                  filename: 'YELLCAMP/q4lj2ezcqozsxgqyja4m',
                },
                {
                  url: 'https://res.cloudinary.com/dp34wlfqo/image/upload/v1709447909/YELLCAMP/n02exrxvjvivj4prlnxv.jpg',
                  filename: 'YELLCAMP/n02exrxvjvivj4prlnxv',
                }
              ],
        });
        await newcamp.save();
    }
}

seedDb();
