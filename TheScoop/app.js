const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const {storeSchema} = require('./schemas.js');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require("./utilities/expressError");
const methodOverride = require('method-override');
const Shop = require('./models/shops.js');

mongoose.connect('mongodb://localhost:27017/cream-shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database connected")
});

const app = express();


app.engine('ejs', engine);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static('public'))

const validateStore = (req, res, next) => {
    const {error} = storeSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/stores', catchAsync(async (req, res) => {
    const stores = await Shop.find({});
    res.render('stores/index', {stores})
}))

app.get('/stores/new', (req, res) => {
    res.render('stores/new')
})

app.post('/stores', validateStore, catchAsync(async (req, res, next) => {
    const store = new Shop(req.body.store);
    await store.save();
    res.redirect(`/stores/${store._id}`)
}))

app.get('/stores/:id', catchAsync(async (req, res) => {
    const store = await Shop.findById(req.params.id)
    res.render('stores/show', {store})
}))

app.get('/stores/:id/edit', catchAsync(async(req,res) => {
    const store = await Shop.findById(req.params.id)
    res.render('stores/edit', {store})
}))

app.put('/stores/:id', validateStore, catchAsync(async (req,res) => {
    const {id} = req.params;
    const store = await Shop.findByIdAndUpdate(id, {...req.body.store});
    res.redirect(`/stores/${store._id}`)
}))

app.delete('/stores/:id', catchAsync(async (req,res) => {
    const {id} = req.params;
    const store = await Shop.findByIdAndDelete(id);
    res.redirect('/stores');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err
    if(!err.message) err.message = "Something went wrong"
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})

