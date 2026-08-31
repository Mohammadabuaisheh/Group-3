const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const Pet = require('../models/pet');
const Report = require('../models/Report');

router.get('/', indexController.getHome);
router.get('/about', indexController.getAbout);
router.get('/features', indexController.getFeatures);
router.get('/contact', indexController.getContact);
router.get('/animal/:id', indexController.getAnimalDetails);

router.get('/report-animal', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('report-animal');
});

router.post('/report-animal', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    try {
        await Report.create({
            animalName: req.body.animalName,
            type: req.body.type,
            status: req.body.status,
            behavior: req.body.behavior,
            location: req.body.location,
            description: req.body.description,
            userId: req.session.user.id
        });
        res.redirect('/my-reports?success=1');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/my-reports', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    try {
        const userReports = await Report.find({ userId: req.session.user.id }).sort({ createdAt: -1 });
        res.render('my-reports', {
            reports: userReports,
            success: req.query.success === '1'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/reports/delete/:id', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    try {
        await Report.findOneAndDelete({
            _id: req.params.id,
            userId: req.session.user.id
        });
        res.redirect('/my-reports');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/theme/:theme', (req, res) => {
    const theme = req.params.theme;
    if (theme === "light" || theme === "dark") {
        res.cookie("theme", theme, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        });
    }
    res.redirect('/search');
});

router.get('/search', async (req, res) => {
    try {
        const search = req.query.search || "";
        const type = req.query.type || "";
        const theme = req.cookies.theme || "light";

        let query = {};

        if (search.trim() !== "") {
            query.name = { $regex: search.trim(), $options: 'i' };
        }

        if (type.trim() !== "") {
            query.type = { $regex: new RegExp(`^${type.trim()}$`, 'i') };
        }

        const filteredPets = await Pet.find(query);

        res.render('search', {
            title: 'Search Pets',
            pets: filteredPets,
            searchQuery: search,
            searchType: type,
            theme: theme
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;