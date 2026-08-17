require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'safepaws_secure_key_2026',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const authRoutes = require("./routes/auth");
const indexRoutes = require("./routes/index");

app.use('/', indexRoutes);
app.use('/', authRoutes);

app.all("/*splat", (req, res) => {
    res.status(404).render('404');
});

app.listen(port, ()=> {
    console.log(`SafePaws server running on http://localhost:${port}`);
});