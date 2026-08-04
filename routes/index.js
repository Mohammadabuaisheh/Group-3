const express = require ('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/features', (req, res) => {
    const safePawsServices = [
        { 
            name: 'Adoption', 
            description: 'Providing a reliable environment that allows users to browse animal details to easily find them a suitable shelter.' 
        },
        { 
            name: 'Reporting', 
            description: 'A rapid reporting system for lost animals or those requiring urgent medical intervention.' 
        },
        { 
            name: 'Donation', 
            description: 'A transparent channel to collect financial support to cover the costs of medical treatment and care.' 
        }
    ];

    res.render('features', { services: safePawsServices });
});

router.get('/contact', (req, res) => {
    res.render('contact'); 
});

router.get('/animal/:id', (req, res) => {
    const animalId = req.params.id;

    res.render('detail', {id: animalId});
});

module.exports = router;