const Pet = require('../models/pet');

const getHome = (req, res) => {
    res.render('home', { activePage: 'home' });
};

const getAbout = (req, res) => {
    const projectTeam = [
        { name: 'Mohammad', id: '2023101' },
        { name: 'Nourhan', id: '2023102' },
        { name: 'Abdulrahman', id: '2023103' },
        { name: 'Mahdi', id: '2023104' },
        { name: 'Yazan', id: '2023105' }
    ];
    res.render('about', { team: projectTeam, activePage: 'about' });
};

const getFeatures = (req, res) => {
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
    res.render('features', { services: safePawsServices, activePage: 'features' });
};

const getContact = (req, res) => {
    res.render('contact', { activePage: 'contact' }); 
};

const getAnimalDetails = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).render('404', { message: 'Animal not found.' });
        }
        res.render('detail', { pet, activePage: 'detail' });
    } catch (err) {
        console.error('Animal Details Error:', err);
        res.status(404).render('404', { message: 'Invalid animal ID.' });
    }
};

module.exports = {
    getHome,
    getAbout,
    getFeatures,
    getContact,
    getAnimalDetails
};