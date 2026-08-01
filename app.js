const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(port, () => {
    console.log(`SafePaws server running on http://localhost:${port}`);
});