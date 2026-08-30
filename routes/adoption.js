const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
};

router.get('/adopt/:petId', isAuthenticated, adoptionController.getApplyPage);
router.post('/adopt/:petId', isAuthenticated, adoptionController.submitApplication);
router.get('/my-adoptions', isAuthenticated, adoptionController.getMyAdoptions);
router.post('/adoptions/cancel/:id', isAuthenticated, adoptionController.cancelApplication);

module.exports = router;