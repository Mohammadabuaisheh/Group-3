const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const indexRoutes = require("./routes/index");
app.use('/', indexRoutes);

app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(port, ()=> {
    console.log(`SafePaws server running on http://localhost:${port}`);
}); 