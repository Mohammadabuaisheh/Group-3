const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.get('/', indexController.getHome);
router.get('/about', indexController.getAbout);
router.get('/features', indexController.getFeatures);
router.get('/contact', indexController.getContact);
router.get('/animal/:id', indexController.getAnimalDetails);

router.get('/report-animal', (req, res) => {
    res.render('report-animal');
});

router.get('/my-reports', (req, res) => {
    res.render('my-reports', { reports: [] });
});




module.exports = router;