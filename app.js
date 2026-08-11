require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

const indexRoutes = require("./routes/index");
app.use('/', indexRoutes);

app.all("/*splat", (req, res) => {
    res.status(404).render('404');
});

app.listen(port, ()=> {
    console.log(`SafePaws server running on http://localhost:${port}`);
}); 