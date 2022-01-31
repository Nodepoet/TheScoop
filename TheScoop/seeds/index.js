const mongoose = require('mongoose');
const Shop = require('../models/shops.js');
const {places, descriptors} = require('./seedHelper');
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/cream-shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database connected")
});


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Shop.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() *1000);
        const price = Math.floor(Math.random() *10) + .99;
        const store = new Shop({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/8118695',
            description: "Describe your tasty expierience!",
            price 
        })
        await store.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})