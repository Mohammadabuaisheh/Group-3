const express = require('express');
const router = express.Router();
const Pet = require('../models/pet');

router.get('/pets/create', (req, res) => {
    res.render('create-pet');
});

router.post('/pets/create', async (req, res) => {
    try {
        await Pet.create({
            name: req.body.name,
            type: req.body.type,
            breed: req.body.breed,
            age: req.body.age,
            gender: req.body.gender,
            description: req.body.description,
            image: req.body.image,
            status: req.body.status
        });

        res.redirect('/pets');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating pet');
    }
});

router.get('/pets', async (req, res) => {
    try {
        const pets = await Pet.find();
        res.render('pets', { pets: pets });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading pets');
    }
});

module.exports = router;