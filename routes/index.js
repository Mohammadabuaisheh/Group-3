const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.get('/', indexController.getHome);
router.get('/about', indexController.getAbout);
router.get('/features', indexController.getFeatures);
router.get('/contact', indexController.getContact);
router.get('/animal/:id', indexController.getAnimalDetails);

module.exports = router;