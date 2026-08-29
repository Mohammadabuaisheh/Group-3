require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const port = 3000;
 
mongoose.connect(process.env.MONGO_URI, {
    family: 4
})
.then(() => console.log('Successfully connected to MongoDB 🐾'))
.catch(err => console.error('MongoDB connection error: ', err));
 
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
});
 
store.on('error', function(error) {
    console.error('Session Store Error:', error);
});
 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
 
app.use(session({
    secret: process.env.SESSION_SECRET || 'safepaws_secure_key_2026',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } 
}));
 
app.use(flash());
 
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
    next();
});
 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
 
const authRoutes = require("./routes/auth");
const indexRoutes = require("./routes/index");
const petRoutes = require('./routes/pet');
 
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/', petRoutes);
 
app.all("/*splat", (req, res) => {
    res.status(404).render('404');
});
 
app.listen(port, () => {
    console.log(`SafePaws server running on http://localhost:${port}`);
});