const express = require ('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/features', (req, res) => {
    res.render('features');
});

router.get('/contact', (req, res) => {
    res.render('contact'); 
});

router.get('/animal/:id', (req, res) => {
    const animalId = req.params.id;

    res.render('detail', {id: animalId});
});

router.get('/report-animal', (req, res) => {
    res.render('report-animal');
});

router.get('/my-reports', (req, res) => {
    res.render('my-reports', { reports: [] });
});




module.exports = router;